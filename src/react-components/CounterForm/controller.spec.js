import assert from 'assert'
import causalityRedux from 'causality-redux'
import {counterFormPartition} from './index'

// The controller functions are in the partition store.
const partitionStore = causalityRedux.store[counterFormPartition]
const partitionState = partitionStore.partitionState

describe('Controller CounterForm', function () {
  const numIterations = 10
  it('increment - validated.', function () {
    // Call the controller function
    const val = partitionState.counter
    for (let i = 0; i < numIterations; ++i) {
      partitionStore.increment()
    }
    assert(partitionState.counter === val + numIterations)
  })

  // Click on the decrement button
  it('decrement validated.', function () {
    // Call the controller function
    const val = partitionState.counter
    for (let i = 0; i < numIterations; ++i) {
      partitionStore.decrement()
    }
    assert(partitionState.counter === val - numIterations)
  })
})
