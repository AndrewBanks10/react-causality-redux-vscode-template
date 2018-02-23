import assert from 'assert'
import { inc, dec } from '../model'

describe('Model CounterForm', function () {
  const numIterations = 1000
  it('inc - validated.', function () {
    // Call the model function
    let val = 0
    for (let i = 0; i < numIterations; ++i) {
      val = inc(val)
    }
    assert(val === numIterations)
  })
  it('dec - validated.', function () {
    // Call the model function
    let val = numIterations
    for (let i = 0; i < numIterations; ++i) {
      val = dec(val)
    }
    assert(val === 0)
  })
})
