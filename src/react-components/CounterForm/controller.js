import CausalityRedux from 'causality-redux';
import { inc, dec } from './model';
import { CounterFormValue, CounterForm } from './view';

const defaultState = { counter: 0 };

const controllerFunctions = {
    increment: () => partitionState.counter = inc(partitionState.counter),
    decrement: () => partitionState.counter = dec(partitionState.counter)
};

export const CounterForm_Partition = 'CounterForm_Partition';

const controllerUIConnections = [
    [
        CounterFormValue,    // React Component to wrap with redux connect
        CounterForm_Partition,
        [],            // Function keys that you want passed into the props of the react component.
        ['counter'],    // Partition keys that you want passed into the props of the react component.
        'CounterFormValue'   // Name of the react component string form
    ],
    [
        CounterForm, // Wrapped component
        CounterForm_Partition,
        ['increment', 'decrement'], 
        ['counter', 'CounterFormValue'], 
        'CounterForm' 
    ]
];

const { partitionState, wrappedComponents } = CausalityRedux.establishControllerConnections({
    module,
    partition: { partitionName: CounterForm_Partition, defaultState, controllerFunctions },
    controllerUIConnections
});

export default wrappedComponents.CounterForm;

