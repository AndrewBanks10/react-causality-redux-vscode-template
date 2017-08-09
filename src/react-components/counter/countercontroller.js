import CausalityRedux from 'causality-redux';
import { increment, decrement } from './countermodel';

const controllerIncrement = () => partitionState.counter = increment(partitionState.counter);
const controllerDecrement = () => partitionState.counter = decrement(partitionState.counter);
 
const COUNTER_STATE = 'COUNTER_STATE';
export default COUNTER_STATE;
const crCounter = {
    partitionName: COUNTER_STATE,
    defaultState: { counter: 0 },
    changerDefinitions: {
        'increment': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: controllerIncrement },
        'decrement': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: controllerDecrement }
    }
};

// This establishes all the connections between the UI and business code.
// It also supports hot reloading for the business logic.
const { partitionState } = CausalityRedux.establishControllerConnections({
    module,
    partition: crCounter
});

