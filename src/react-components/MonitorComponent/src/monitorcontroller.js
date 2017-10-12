import CausalityRedux from 'causality-redux';
import 'react-causality-redux';

export const MONITOR_STATE = 'MONITOR_STATE';

const monitorPartitionDef = {
    partitionName: MONITOR_STATE,
    defaultState: {
        data: [],
        partitionSelect: false,
        partitions: [],
        isDebugging: false,
        currentState: -1,
        display: true,
        isMinimized: false
    },
    changerDefinitions: {
        'selectAll': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: selectAll },
        'partitionSelected': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: partitionSelected },
        'selectPartition': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: selectPartition },
        'startDebug': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: startDebug },
        'clickedState': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: clickedState },
        'forwardOneState': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: forwardOneState },
        'backOneState': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: backOneState },
        'stopDebug': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: stopDebug },
        'replayStates': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: replayStates },
        'beginning': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: beginning },
        'exit': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: exit },
        'minimize': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: minimize },
        'maximize': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: maximize },
        'removeAll': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: removeAll }
    }
};

let states = [];
let allStates = [];
const listeners = [];
let monitorPartition = '';

const isBasicObjectType = (obj) => Object.prototype.toString.call(obj).slice(8, -1) === 'Object';

function discloseStates() {
    let discloseStates;
    if (partitionState.isDebugging)
        discloseStates = states;
    else
        discloseStates = allStates;    
    const data = [];
    discloseStates.forEach(e => {
        if (monitorPartition === '' || monitorPartition === e.partitionName) {
            let strObj = '';
            if (typeof e.nextState['crFunctionCall'] !== 'undefined') {
                strObj = `${e.nextState['crFunctionCall']}(${e.nextState['args'].toString()})`;
            } else {
                CausalityRedux.getKeys(e.nextState).forEach(key => {
                    if (e.nextState[key] !== e.prevState[key]) {
                        if (strObj !== '')
                            strObj += ', ';
                        strObj += `${key}: ${e.nextState[key]}`;
                    }
                });
            }    
            data.push(`${e.partitionName}: {${strObj}}`);
        }    
    });
    partitionState.data = data;    
}

//
// The two functions below will disclose all transactions to the causality redux store.
//
function onStateChange(arg) {
    if (!partitionState.isDebugging && arg.partitionName !== MONITOR_STATE) {
        allStates.push(arg);
        setTimeout(discloseStates, 1);
    }   
}

function onListener(arg) {
    if (arg.partitionName !== MONITOR_STATE)
        listeners.push(arg);
}

function selectAll() {
    monitorPartition = '';
    setTimeout(discloseStates, 1); 
}

function partitionSelected(partition) {
    monitorPartition = partition;
    partitionState.partitionSelect = false;
    setTimeout(discloseStates, 1); 
}

function selectPartition() {
    const partitions = [];
    Object.keys(CausalityRedux.store.getState()).forEach(e => {
        partitions.push(e);
    });
    partitionState.partitionSelect = true;
    setState({partitionSelect: true, partitions});
}

function executeChanger(stateObj) {
    const partitionDefinitions = CausalityRedux.partitionDefinitions;
    const partitionDefinition = partitionDefinitions.find(e =>
        stateObj.partitionName === e.partitionName
    );
    if (partitionDefinition && stateObj.changerName !== 'setState') {
        const changerEntry = partitionDefinition.changerDefinitions[stateObj.changerName];
        if (changerEntry && changerEntry.arrayArgShape) {
            let index = 0;
            for (; index < stateObj.args.length; ++index)
                if (isBasicObjectType(stateObj.args[index]))
                    break;
            if (index < stateObj.args.length) {
                const args = {};
                CausalityRedux.getKeys(changerEntry.arrayArgShape).forEach(key => {
                    args[key] = stateObj.args[index][key];
                });
                stateObj.args[index] = args;
            }
        }
    }
    const changer = CausalityRedux.store[stateObj.partitionName][stateObj.changerName];
    changer(...stateObj.args);
}

function initializeState() {
    for (let i = states.length - 1; i >= 0; --i)
        CausalityRedux.store[states[i].partitionName].setState(states[i].prevState);
}

function replayStates() {
    initializeState();
    const len = states.length;
    for (let i = 0; i < len; ++i)
        executeChanger(states[i]);
    partitionState.currentState = states.length - 1;
}

function beginning() {
    initializeState();
    partitionState.currentState = -1;
}

function stopDebug() {
    replayStates();
    partitionState.isDebugging = false;
    partitionState.currentState = -1;
}

function startDebug() {
    if (allStates.length === 0)
        return;  
    
    if (monitorPartition === '')
        states = allStates;
    else
        states = allStates.filter(e =>
            e.partitionName === monitorPartition
        );   
  
    partitionState.isDebugging = true;
    partitionState.currentState = states.length - 1;
}

function exit() {
    partitionState.display = false;
}

function clickedState(index) {
    if(!partitionState.isDebugging)
        return;
    let currentState = partitionState.currentState;
    if (index < currentState) {
        while (index < currentState) {
            CausalityRedux.store[states[currentState].partitionName].setState(states[currentState].prevState);
            --currentState;
        }
    } else {
        while (index > currentState) {
            ++currentState;
            executeChanger(states[currentState]);
        }
    }
    partitionState.currentState = index;
}

function forwardOneState() {
    if (partitionState.currentState === states.length - 1)
        return;    
    const i = partitionState.currentState + 1;
    executeChanger(states[i]);
    partitionState.currentState = i;
}

function backOneState() {
    const i = partitionState.currentState;
    if (i === -1)
        return;   
    CausalityRedux.store[states[i].partitionName].setState(states[i].prevState); 
    --partitionState.currentState;
}

function minimize() {
    partitionState.isMinimized = true;
}

function maximize() {
    partitionState.isMinimized = false;
}

function removeAll() {
    allStates = [];
    setTimeout(discloseStates, 1); 
}

const { partitionState } = CausalityRedux.establishControllerConnections({
    module,
    partition: monitorPartitionDef
});

const { setState } = CausalityRedux.store[MONITOR_STATE];
CausalityRedux.setOptions({ onStateChange, onListener });

