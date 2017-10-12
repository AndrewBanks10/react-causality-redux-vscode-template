import CausalityRedux from 'causality-redux';
import { increment, decrement } from '../model/countermodel';
import CounterFormValue from '../view/counterUI';

const controllerIncrement = () => partitionState.counter = increment(partitionState.counter);
const controllerDecrement = () => partitionState.counter = decrement(partitionState.counter);
 
const COUNTER_STATE = 'COUNTER_STATE';
const crCounter = {
    partitionName: COUNTER_STATE,
    defaultState: { counter: 0 },
    controllerFunctions:
    {
        'increment': controllerIncrement,
        'decrement': controllerDecrement
    }
};

// This establishes all the connections between the UI and business code.
// It also supports hot reloading for the business logic.
const { partitionState } = CausalityRedux.establishControllerConnections({
    module,
    partition: crCounter
});


const controllerUIConnections = [
    [
        CounterFormValue,    // React Component to wrap with redux connect
        COUNTER_STATE,// Partition Name
        [],            // Function keys that you want passed into the props of the react component.
        ['counter'],    // Partition keys that you want passed into the props of the react component.
        'CounterFormValue'   // Name of the react component string form
    ]
];

// Make the connections happen and save the wrapped components for export.
const exportObj = controllerUIConnections.reduce((exportObj, entry) => {
    exportObj[entry[4]] = CausalityRedux.connectChangersAndStateToProps(...entry);
    return exportObj;
}, { COUNTER_STATE });

export default exportObj;

