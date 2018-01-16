import causalityRedux from 'causality-redux'
import MonitorComponent from '../view/view'
import { setIsTypeScript } from '../model/sourcemaps'
import '../model/hmrchangedmodules'
import { defaultState, uiServiceFunctions } from './core'
import { handleTSSourceMaps } from './sourcemaps'

if (typeof history !== 'undefined' && typeof history.setMonitorOn === 'function') {
  history.setMonitorOn()
}
setIsTypeScript(causalityRedux.globalStore.partitionState.isTypescript)

let setState
let getState
let wrappedComponents
const stateMonitorPartition = 'stateMonitorPartition'

const ret = causalityRedux.establishControllerConnections({
  module,
  partition: { partitionName: stateMonitorPartition, defaultState, uiServiceFunctions },
  uiComponent: MonitorComponent, // Redux connect will be called on this component and returned as uiComponent in the returned object.
  storeKeys: ['clipBoard', 'displayModule', 'nextState', 'partitionName', 'moduleName', 'line', 'data', 'isDebugging', 'currentState', 'display', 'isMinimized'],
  changerKeys: ['closeDisplayModule', 'startDebug', 'clickedState', 'backOneState', 'forwardOneState', 'stopDebug', 'replayStates', 'beginning', 'exit', 'minimize', 'maximize', 'setThisState'],
  uiComponentName: 'MonitorComponent'
});
({ setState, getState, wrappedComponents } = ret)

export default wrappedComponents.MonitorComponent
export { setState, getState, stateMonitorPartition, handleTSSourceMaps }
