import { establishControllerConnections } from 'react-causality-redux'
import { defaultState, controllerFunctions } from './controller'
import { CounterFormValue, CounterForm } from './view'

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

const { partitionState, wrappedComponents } = establishControllerConnections({
  module,
  partition: { partitionName: counterFormPartition, defaultState, controllerFunctions },
  controllerUIConnections
})

export { partitionState }

export default wrappedComponents.CounterForm
