import CausalityRedux from 'causality-redux';
import { setHistoryState } from 'react-causality-redux-router';
import MonitorComponent from './view';

const MonitorComponent_Partition = 'MonitorComponent_Partition';

const allStates = [];
const listeners = [];

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

const MAXOBJSTRING = 23;
function toString(e) {
    let str = e.toString();
    if (str.length <= MAXOBJSTRING)
        return str;
    str = str.slice(0, MAXOBJSTRING - 3);
    str += '...';
    return str;
}

function discloseStates() {
    const data = [];
    allStates.forEach(e => {
        let strObj = '';
        CausalityRedux.getKeys(e.nextState).forEach(key => {
            if (e.nextState[key] !== e.prevState[key]) {
                if (strObj !== '')
                    strObj += ', ';
                strObj += `${key}: ${toString(e.nextState[key])}`;
            }
        });
        if (typeof e.nextState === 'undefined')
            data.push('Initial Store');
        else {
            if ( strObj !== '')
                data.push(`${e.partitionName}: {${strObj}}`);
        }
    });
    monitorMirroredState.data = data;
    setMonitorState();
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
    discloseStates();
    setMonitorState();
    setState({isDebugging:false, currentState:-1});
    allStates[currentState].store[MonitorComponent_Partition] = getState();
    copyStoreState(currentState);
    if (typeof setHistoryState === 'function') {
        setHistoryState(allStates[currentState].store);
    }
}

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

const controllerUIConnections = [
    [
        MonitorComponent, // Wrapped component
        MonitorComponent_Partition,
        ['startDebug', 'clickedState', 'backOneState', 'forwardOneState', 'stopDebug', 'replayStates', 'beginning', 'exit', 'minimize', 'maximize', 'setThisState'], // Changers made avilable through the props to this component.
        ['data', 'isDebugging', 'currentState', 'display', 'isMinimized'], //data made available through the props.
        'MonitorComponent'
    ]
];

const { setState, partitionState, getState } = CausalityRedux.establishControllerConnections({
    module,
    partition: {partitionName: MonitorComponent_Partition, defaultState, controllerFunctions},
    controllerUIConnections
});

const isCausalityReduxComponent = (obj) =>
    typeof obj !== 'undefined' && typeof obj.prototype !== 'undefined' && typeof obj.prototype.isCausalityReduxComponent !== 'undefined';

const copyHotReloadedComponents = (partitionName, partition) => {
    CausalityRedux.getKeys(partition).forEach(partitionKey => {
        if (isCausalityReduxComponent(partition[partitionKey])) {
            allStates.forEach(entry => {
                if (typeof entry.store[partitionName][partitionKey] !== 'undefined')
                    entry.store[partitionName][partitionKey] = partition[partitionKey];
            });
            delete partition[partitionKey];
        }
    });
};  

function onStateChange(arg) {
    if (arg.partitionName !== MonitorComponent_Partition && monitorMirroredState.isDebugging) {
        setTimeout(stopDebug, 1);
    }
    if (arg.partitionName !== MonitorComponent_Partition && arg.operation !== CausalityRedux.operations.STATE_FUNCTION_CALL) {
        arg.store = CausalityRedux.store.getState();
        // First state
        if (allStates.length === 0) {
            const firstArg = CausalityRedux.merge({}, arg);
            delete firstArg.nextState;
            allStates.push(firstArg);
            arg.store = CausalityRedux.shallowCopy(arg.store);
        }

        arg.nextState = CausalityRedux.shallowCopy(arg.nextState);
        // Copy the hot reloaded components from arg.nextState down to the stores in the array.
        // This way set state at any index will have the newest hot reloaded components.
        copyHotReloadedComponents(arg.partitionName, arg.nextState);

        // Remove keys that are equal to the previous.
        CausalityRedux.getKeys(arg.nextState).forEach(key => {
            if (arg.nextState[key] === arg.prevState[key]) {
                delete arg.nextState[key];
            }
        });

        // Only record if changes to state happened that are not hot reloaded components.
        if (CausalityRedux.getKeys(arg.nextState).length > 0) {
            arg.store[arg.partitionName] = CausalityRedux.merge({}, arg.store[arg.partitionName], arg.nextState);
            arg.store[CausalityRedux.storeVersionKey] = arg[CausalityRedux.storeVersionKey];
            allStates.push(arg);
            setTimeout(discloseStates, 1);
        }    
    }   
}

function onListener(arg) {
    if (arg.partitionName !== MonitorComponent_Partition && arg.operation !== CausalityRedux.operations.STATE_FUNCTION_CALL) {
        listeners.push(arg);
    }
}

CausalityRedux.setOptions({ onStateChange, onListener });

export default partitionState.MonitorComponent;