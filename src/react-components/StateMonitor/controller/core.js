import causalityRedux from 'causality-redux'
import { setState, getState, stateMonitorPartition } from './setup'
import { copyHotReloadedComponents } from './hmr'
import { mapModulesOnStack } from './sourcemaps'
import getStackTrace from '../model/callstack'

export const allStates = []

export const defaultState = {
  data: [],
  isDebugging: false,
  currentState: -1,
  display: true,
  isMinimized: false,
  displayModule: false,
  moduleName: '',
  line: 0,
  partitionName: '',
  nextState: {},
  clipBoard: ''
}

//
// Since state can go forward and back, this would affect the monitor negatively.
// Hence, some data must be kept out of the redux store in order to keep the monitor stable.
//
const monitorMirroredState = causalityRedux.merge({}, defaultState)

const MAXOBJSTRING = 23
function toString (e) {
  let str = e.toString()
  if (str.length <= MAXOBJSTRING) {
    return str
  }
  str = str.slice(0, MAXOBJSTRING - 3) + '...'
  return str
}

export function discloseStates () {
  const data = []
  allStates.forEach(e => {
    let strObj = ''
    causalityRedux.getKeys(e.nextState).forEach(key => {
      if (e.nextState[key] !== e.prevState[key]) {
        if (strObj !== '') {
          strObj += ', '
        }
        strObj += `${key}: ${toString(e.nextState[key])}`
      }
    })
    if (typeof e.nextState === 'undefined') {
      data.push('Initial Store')
    } else {
      if (strObj !== '') {
        data.push(`${e.partitionName}: {${strObj}}`)
      }
    }
  })
  monitorMirroredState.data = data
  setMonitorState()
}

function setMonitorState () {
  setState(monitorMirroredState)
}

function copyStoreState (position) {
  causalityRedux.copyState(allStates[position].store)
}

function beginning () {
  copyStoreState(0)
  monitorMirroredState.currentState = -1
  setMonitorState()
}

function stopDebug () {
  replayStates()
  monitorMirroredState.displayModule = false
  monitorMirroredState.isDebugging = false
  monitorMirroredState.currentState = -1
  setMonitorState()
}

function startDebug () {
  if (allStates.length === 0) {
    return
  }

  monitorMirroredState.isDebugging = true
  monitorMirroredState.currentState = allStates.length - 1
  setMonitorState()
}

function replayStates () {
  const position = allStates.length - 1
  copyStoreState(position)
  monitorMirroredState.currentState = position
  setMonitorState()
}

function exit () {
  monitorMirroredState.display = false
  setMonitorState()
}

function clickedState (index) {
  // Display module and line
  if (!monitorMirroredState.isDebugging) {
    if (typeof allStates[index].callStack !== 'undefined') {
      const tos = allStates[index].callStack.length - 1
      setState({
        displayModule: true,
        clipBoard: JSON.stringify({ file: allStates[index].callStack[tos].moduleName, line: allStates[index].callStack[tos].line, stack: allStates[index].callStack }),
        moduleName: allStates[index].callStack[tos].moduleName,
        line: allStates[index].callStack[tos].line,
        partitionName: allStates[index].partitionName,
        nextState: allStates[index].nextState
      })
    }
    return
  }
  copyStoreState(index)
  monitorMirroredState.currentState = index
  setMonitorState()
}

function forwardOneState () {
  const i = monitorMirroredState.currentState
  if (i === allStates.length - 1) {
    return
  }
  copyStoreState(i + 1)
  monitorMirroredState.currentState++
  setMonitorState()
}

function backOneState () {
  const i = monitorMirroredState.currentState
  if (i === 0) {
    return
  }
  copyStoreState(i - 1)
  --monitorMirroredState.currentState
  setMonitorState()
}

function minimize () {
  monitorMirroredState.isMinimized = true
  setMonitorState()
}

function maximize () {
  monitorMirroredState.isMinimized = false
  setMonitorState()
}

function setThisState () {
  const currentState = monitorMirroredState.currentState
  if (typeof history.setHistoryState === 'function') {
    const state = allStates[currentState].store
    const stack = state[causalityRedux.storeHistoryKey].stack
    if (stack.length === 1 && history.length > 1) {
      alert('Not able to set to this state since it means the history current with > 1 entry must be set back to one entry which is not permitted in javascript.')
      return
    }
  }

  monitorMirroredState.isDebugging = false
  monitorMirroredState.currentState = -1
  allStates.length = currentState + 1
  discloseStates()
  setMonitorState()
  setState({isDebugging: false, currentState: -1})
  allStates[currentState].store[stateMonitorPartition] = getState()
  copyStoreState(currentState)
  if (typeof history.setHistoryState === 'function') {
    history.setHistoryState(allStates[currentState].store)
  }
}

const endDebug = () =>
  (setTimeout(stopDebug, 1))

const closeDisplayModule = () =>
  (setState({displayModule: false}))

export const uiServiceFunctions = {
  startDebug,
  clickedState,
  forwardOneState,
  backOneState,
  stopDebug,
  replayStates,
  beginning,
  exit,
  minimize,
  maximize,
  setThisState,
  closeDisplayModule,
  endDebug
}

function onStateChange (arg) {
  if (monitorMirroredState.isDebugging) {
    return
  }
  if (arg.partitionName !== stateMonitorPartition &&
    arg.partitionName !== causalityRedux.storeHistoryKey &&
    arg.operation !== causalityRedux.operations.STATE_FUNCTION_CALL) {
    arg.store = causalityRedux.shallowCopy(causalityRedux.store.getState())
    arg.nextState = causalityRedux.shallowCopy(arg.nextState)
    // Copy the hot reloaded components from arg.nextState down to the stores in the array.
    // This way set state at any index will have the newest hot reloaded components.
    copyHotReloadedComponents(arg.partitionName, arg.nextState)

    // Remove keys that are equal to the previous.
    causalityRedux.getKeys(arg.nextState).forEach(key => {
      if (arg.nextState[key] === arg.prevState[key]) {
        delete arg.nextState[key]
      }
    })

    // Only record if changes to state happened that are not hot reloaded components.
    if (causalityRedux.getKeys(arg.nextState).length > 0) {
      arg.callStack = mapModulesOnStack(getStackTrace())
      arg.store[arg.partitionName] = causalityRedux.merge({}, arg.store[arg.partitionName], arg.nextState)
      arg.store[causalityRedux.storeVersionKey] = arg[causalityRedux.storeVersionKey]
      allStates.push(arg)
      setTimeout(discloseStates, 1)
    }
  }
}

causalityRedux.setOptions({ onStateChange })

// First state
const firstArg = {}
firstArg.store = causalityRedux.shallowCopyStorePartitions()
allStates.push(firstArg)
setTimeout(discloseStates, 1)
