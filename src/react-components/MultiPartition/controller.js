import { establishControllerConnections } from 'react-causality-redux'
import { counterFormPartition } from '../CounterForm'
import { commentBoxPartition } from '../CommentForm'
import MultiPartitionForm from './view'

const controllerUIConnections = [
  [
    MultiPartitionForm, // React Component to wrap with redux connect
    // Used an array of objects to attach multiple partitions to the component's props
    [
      { partitionName: counterFormPartition, changers: ['increment'], stateEntries: ['counter'] },
      { partitionName: commentBoxPartition, changers: [], stateEntries: ['items'] }
    ],
    'MultiPartitionForm' // Name of the react component string form
  ]
]

const { wrappedComponents } = establishControllerConnections({
  module,
  controllerUIConnections
})

export default wrappedComponents.MultiPartitionForm
