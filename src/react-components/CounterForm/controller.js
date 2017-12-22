import { establishControllerConnections } from 'react-causality-redux'
import { inc, dec } from './model'
import { CounterFormValue, CounterForm } from './view'

let partitionState, wrappedComponents

const defaultState = { counter: 0 }

const controllerFunctions = {
  increment: () => (partitionState.counter = inc(partitionState.counter)),
  decrement: () => (partitionState.counter = dec(partitionState.counter))
}

export const counterFormPartition = 'counterFormPartition'

const controllerUIConnections = [
  [
    CounterFormValue, // React Component to wrap with redux connect
    counterFormPartition,
    [], // Function keys that you want passed into the props of the react component.
    ['counter'], // Partition keys that you want passed into the props of the react component.
    'CounterFormValue' // Name of the react component string form
  ],
  [
    CounterForm, // Wrapped component
    counterFormPartition,
    ['increment', 'decrement'],
    ['counter', 'CounterFormValue'],
    'CounterForm'
  ]
]

const ret = establishControllerConnections({
  module,
  partition: { partitionName: counterFormPartition, defaultState, controllerFunctions },
  controllerUIConnections
});
({ partitionState, wrappedComponents } = ret)

export default wrappedComponents.CounterForm
