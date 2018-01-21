import { establishControllerConnections } from 'react-causality-redux'
import { defaultState, uiServiceFunctions } from './controller'
import { CounterFormValue, CounterForm } from './view'

export const counterFormPartition = 'counterFormPartition'

const controllerUIConnections = [
  {
    uiComponent: CounterFormValue, // React Component to wrap with redux connect
    partitionName: counterFormPartition,
    changerKeys: [], // Function keys that you want passed into the props of the react component.
    storeKeys: ['counter'], // Partition keys that you want passed into the props of the react component.
    uiComponentName: 'CounterFormValue' // Name of the react component string form
  },
  {
    uiComponent: CounterForm,
    partitionName: counterFormPartition,
    // changerKeys is not listed hence, the default will add all uiServiceFunctions to the props of CounterForm.
    storeKeys: ['counter', 'CounterFormValue'],
    uiComponentName: 'CounterForm'
  }
]

const { partitionStore, partitionState, getState, setState, subscribe, wrappedComponents } = establishControllerConnections({
  module,
  partition: { partitionName: counterFormPartition, defaultState, uiServiceFunctions },
  controllerUIConnections
})

export { partitionStore, partitionState, getState, setState, subscribe }

export default wrappedComponents.CounterForm
