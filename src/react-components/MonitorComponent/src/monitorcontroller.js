import CausalityRedux from 'causality-redux';
import 'react-causality-redux';
import { setHistoryState } from 'react-causality-redux-router';

const defaultState = {
    data: [],
    isDebugging: false,
    currentState: -1,
    display: true,
    isMinimized: false
};

//
// Since state can go forward and back, this would affect the monitor negatively.
// Hence, some data must be kept out of the redux store in order to keep the monitor stable. 
//
const monitorMirroredState = CausalityRedux.merge({}, defaultState);

const controllerFunctions = {
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
    setThisState
};

export const MONITOR_STATE = 'MONITOR_STATE';

const monitorPartitionDef = {
    partitionName: MONITOR_STATE,
    defaultState,
    controllerFunctions
};

const allStates = [];
const listeners = [];

function discloseStates() {
    const data = [];
    allStates.forEach(e => {
        let strObj = '';
        CausalityRedux.getKeys(e.nextState).forEach(key => {
            if (e.nextState[key] !== e.prevState[key]) {
                if (strObj !== '')
                    strObj += ', ';
                strObj += `${key}: ${e.nextState[key]}`;
            }
        });
        if (typeof e.nextState === 'undefined')
            data.push('Initial Store');  
        else
            data.push(`${e.partitionName}: {${strObj}}`);
    });
    monitorMirroredState.data = data;
    setMonitorState();
}

//
// The two functions below will disclose all transactions to the causality redux store.
//
function onStateChange(arg) {
    if (arg.partitionName !== MONITOR_STATE && monitorMirroredState.isDebugging) {
        setTimeout(stopDebug, 1);
    }
    if (arg.partitionName !== MONITOR_STATE && arg.operation !== CausalityRedux.operations.STATE_FUNCTION_CALL) {
        arg.store = CausalityRedux.store.getState();
        // First state
        if (allStates.length === 0) {
            const firstArg = CausalityRedux.merge({}, arg);
            delete firstArg.nextState;
            allStates.push(firstArg);
            arg.store = CausalityRedux.merge({}, arg.store);
        }
        arg.store[arg.partitionName] = CausalityRedux.merge({}, arg.store[arg.partitionName], arg.nextState);
        arg.store[CausalityRedux.storeVersionKey] = arg[CausalityRedux.storeVersionKey];
        allStates.push(arg);
        setTimeout(discloseStates, 1);
    }   
}

function onListener(arg) {
    if (arg.partitionName !== MONITOR_STATE && arg.operation !== CausalityRedux.operations.STATE_FUNCTION_CALL) {
        listeners.push(arg);
    }
}

function setMonitorState()
{
    setState(monitorMirroredState);
}

function copyStoreState(position) {
    CausalityRedux.copyState(allStates[position].store);
}

function replayStates() {
    const position = allStates.length - 1; 
    copyStoreState(position);
    monitorMirroredState.currentState = position;
    setMonitorState();
}

function beginning() {
    copyStoreState(0);
    monitorMirroredState.currentState = -1;
    setMonitorState();
}

function stopDebug() {
    replayStates();
    monitorMirroredState.isDebugging = false;
    monitorMirroredState.currentState = -1;
    setMonitorState();
}

function startDebug() {
    if (allStates.length === 0)
        return;  
  
    monitorMirroredState.isDebugging = true;
    monitorMirroredState.currentState = allStates.length - 1;
    setMonitorState();
}

function exit() {
    monitorMirroredState.display = false;
    setMonitorState();
}

function clickedState(index) {
    if (!monitorMirroredState.isDebugging)
        return;
    copyStoreState(index);
    monitorMirroredState.currentState = index;
    setMonitorState();
}

//OK
function forwardOneState() {
    const i = monitorMirroredState.currentState;
    if (i === allStates.length - 1)
        return; 
    copyStoreState(i+1); 
    monitorMirroredState.currentState++;
    setMonitorState();
}

function backOneState() {
    const i = monitorMirroredState.currentState;
    if (i === -1)
        return;   
    copyStoreState(i-1);
    --monitorMirroredState.currentState;
    setMonitorState();
}

function minimize() {
    monitorMirroredState.isMinimized = true;
    setMonitorState();
}

function maximize() {
    monitorMirroredState.isMinimized = false;
    setMonitorState();
}

function setThisState() {
    const currentState = monitorMirroredState.currentState;
    allStates.length = currentState + 1;
    copyStoreState(currentState);
    if ( typeof setHistoryState === 'function')
        setHistoryState(allStates[currentState].store);
    discloseStates();
    setMonitorState();
}

const { setState } = CausalityRedux.establishControllerConnections({
    module,
    partition: monitorPartitionDef
});

CausalityRedux.setOptions({ onStateChange, onListener });

