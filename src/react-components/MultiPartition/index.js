import { establishControllerConnections } from 'react-causality-redux'
import { counterFormPartition } from '../CounterForm'
import { commentBoxPartition } from '../CommentForm'
import { defaultState, controllerFunctions } from './controller'
import MultiPartitionForm from './view'

const multiFormPartition = 'multiFormPartition'

const controllerUIConnections = [
  [
    MultiPartitionForm, // React Component to wrap with redux connect
    // Used an array of objects to attach multiple partitions to the component's props
    [
      { partitionName: multiFormPartition, storeKeys: ['fixedValue'] },
      { partitionName: counterFormPartition, changerKeys: ['increment'], storeKeys: ['counter'] },
      { partitionName: commentBoxPartition, storeKeys: ['items'] }
    ],
    'MultiPartitionForm' // Name of the react component string form
  ]
]

const { wrappedComponents } = establishControllerConnections({
  module,
  partition: { partitionName: multiFormPartition, defaultState, controllerFunctions },
  controllerUIConnections
})

export default wrappedComponents.MultiPartitionForm
