import CausalityRedux from 'causality-redux'
import { counterFormPartition } from '../CounterForm/controller'
import { commentBoxPartition } from '../CommentForm/controller'
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

const { wrappedComponents } = CausalityRedux.establishControllerConnections({
  module,
  controllerUIConnections
})

export default wrappedComponents.MultiPartitionForm
