import { establishControllerConnections } from 'react-causality-redux'
import { Loader1, ErrorMessage, AjaxDemoCausalityChain } from './view'
import { defaultState, uiServiceFunctions } from './controller'

const ajaxDemoCausalityChainPartition = 'ajaxDemoCausalityChainPartition'

const controllerUIConnections = [
  [
    Loader1, // React Component to wrap with redux connect
    ajaxDemoCausalityChainPartition,
    [], // Function keys that you want passed into the props of the react component.
    ['getIsBusy'], // Partition keys that you want passed into the props of the react component.
    'Loader1' // Name of the react component string form
  ],
  [
    ErrorMessage,
    ajaxDemoCausalityChainPartition,
    ['clearError'],
    ['error'],
    'ErrorMessage'
  ],
  [
    AjaxDemoCausalityChain,
    ajaxDemoCausalityChainPartition,
    ['onGet', 'onAbortGet', 'clear'],
    ['data', 'getIsBusy', 'ErrorMessage', 'Loader1'],
    'AjaxDemoCausalityChain'
  ]
]

// This establishes all the connections between the UI and business code.
// It also supports hot reloading for the business logic.
const { partitionState, setState, wrappedComponents } = establishControllerConnections({
  module,
  partition: { partitionName: ajaxDemoCausalityChainPartition, defaultState, uiServiceFunctions },
  controllerUIConnections
})

export { ajaxDemoCausalityChainPartition, partitionState, setState }

export default wrappedComponents.AjaxDemoCausalityChain
