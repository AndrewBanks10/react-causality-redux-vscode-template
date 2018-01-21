import { establishControllerConnections } from 'react-causality-redux'
import { Loader1, ErrorMessage, AjaxDemoCausalityChain } from './view'
import { defaultState, uiServiceFunctions } from './controller'

const ajaxDemoCausalityChainPartition = 'ajaxDemoCausalityChainPartition'

const controllerUIConnections = [
  {
    uiComponent: Loader1, // React Component to wrap with redux connect
    partitionName: ajaxDemoCausalityChainPartition,
    changerKeys: [], // Function keys that you want passed into the props of the react component.
    storeKeys: ['getIsBusy'], // Partition keys that you want passed into the props of the react component.
    uiComponentName: 'Loader1' // Name of the react component string form
  },
  {
    uiComponent: ErrorMessage,
    partitionName: ajaxDemoCausalityChainPartition,
    changerKeys: ['clearError'],
    storeKeys: ['error'],
    uiComponentName: 'ErrorMessage'
  },
  {
    uiComponent: AjaxDemoCausalityChain,
    partitionName: ajaxDemoCausalityChainPartition,
    changerKeys: ['onGet', 'onAbortGet', 'clear'],
    storeKeys: ['data', 'getIsBusy', 'ErrorMessage', 'Loader1'],
    uiComponentName: 'AjaxDemoCausalityChain'
  }
]

// This establishes all the connections between the UI and business code.
// It also supports hot reloading for the business logic.
const { partitionState, setState, getState, wrappedComponents } = establishControllerConnections({
  module,
  partition: { partitionName: ajaxDemoCausalityChainPartition, defaultState, uiServiceFunctions },
  controllerUIConnections
})

export { ajaxDemoCausalityChainPartition, partitionState, setState, getState }

export default wrappedComponents.AjaxDemoCausalityChain
