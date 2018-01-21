import { establishControllerConnections } from 'react-causality-redux'
import { counterFormPartition } from '../CounterForm'
import { commentBoxPartition } from '../CommentForm'
import { defaultState, uiServiceFunctions } from './controller'
import MultiPartitionForm from './view'

const multiFormPartition = 'multiFormPartition'

const controllerUIConnections = [
  {
    uiComponent: MultiPartitionForm, // React Component to wrap with redux connect
    // Use an array of objects to attach multiple partitions to the component's props
    partitions: [
      // The entry below is from this partition.
      { partitionName: multiFormPartition, storeKeys: ['fixedValue'] },
      // Include the increment function and counter state variable from
      // the counterFormPartition component.
      { partitionName: counterFormPartition, changerKeys: ['increment'], storeKeys: ['counter'] },
      // Include items from the commentBoxPartition component. changerKeys: [] means
      // do not include any uiServiceFunctions from commentBoxPartition.
      { partitionName: commentBoxPartition, changerKeys: [], storeKeys: ['items'] }
    ],
    uiComponentName: 'MultiPartitionForm' // Name of the react component string form
  }
]

const { wrappedComponents } = establishControllerConnections({
  module,
  partition: { partitionName: multiFormPartition, defaultState, uiServiceFunctions },
  controllerUIConnections
})

export default wrappedComponents.MultiPartitionForm
