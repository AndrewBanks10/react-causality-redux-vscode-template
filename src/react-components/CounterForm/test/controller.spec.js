import assert from 'assert'
import { partitionStore, partitionState, getState, setState, subscribe } from '../'

let checkedCounter
const listener = obj => {
  checkedCounter = obj.counter
}

describe('Controller CounterForm', function () {
  const numIterations = 10
  it('increment - validated.', function () {
    // Call the UI service function
    const val = partitionState.counter
    for (let i = 0; i < numIterations; ++i) {
      partitionStore.increment()
    }
    assert(partitionState.counter === val + numIterations)
  })

  // Click on the decrement button
  it('decrement validated.', function () {
    // Call the UI service function
    const val = partitionState.counter
    for (let i = 0; i < numIterations; ++i) {
      partitionStore.decrement()
    }
    assert(partitionState.counter === val - numIterations)
  })
  it('setState, getState validated.', function () {
    setState({ counter: 10 })
    assert(getState().counter === 10)
  })
  it('subscribe validated.', function () {
    subscribe(listener, ['counter'])
    partitionState.counter = 20
    assert(checkedCounter === 20)
    partitionState.counter = 0
  })
})
