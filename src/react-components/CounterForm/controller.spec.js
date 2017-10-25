import assert from 'assert';
import CausalityRedux from 'causality-redux';
import {CounterForm_Partition} from './controller';

// The controller functions are in the partition store.
const partitionStore = CausalityRedux.store[CounterForm_Partition];
const partitionState = partitionStore.partitionState;

describe('Controller CounterForm', function() {
    const numIterations = 10;
    it('increment - validated.', function() {
        // Call the controller function
        const val = partitionState.counter;
        for (let i = 0; i < numIterations; ++i)
            partitionStore.increment();
        assert(partitionState.counter === val + numIterations);
    });

     // Click on the decrement button  
    it('decrement validated.', function() {
        // Call the controller function
        const val = partitionState.counter;
        for (let i = 0; i < numIterations; ++i)
            partitionStore.decrement();
        assert(partitionState.counter === val - numIterations);
    });
});