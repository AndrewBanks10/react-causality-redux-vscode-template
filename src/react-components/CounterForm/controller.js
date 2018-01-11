import { inc, dec } from './model'
import { partitionState } from './index'

export const defaultState = {
  counter: 0
}

export const uiServiceFunctions = {
  increment: () => (partitionState.counter = inc(partitionState.counter)),
  decrement: () => (partitionState.counter = dec(partitionState.counter))
}
