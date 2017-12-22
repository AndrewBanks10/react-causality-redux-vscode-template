import { establishControllerConnections } from 'react-causality-redux'
import { handleGet, handleAbort } from './model'
import { Loader1, ErrorMessage, AjaxDemoCausalityChain } from './view'

let partitionState, setState, wrappedComponents

const defaultState = {
  data: [],
  spinnerCount: 0,
  error: '',
  getIsBusy: false
}

const controllerFunctions = {
  onGet: () => {
    partitionState.getIsBusy = true
    handleGet(
      (data) => { setState({ getIsBusy: false, data }) },
      (error) => { setState({ getIsBusy: false, error }) }
    )
  },
  onAbortGet: () => {
    handleAbort()
    partitionState.getIsBusy = false
  },
  clearError: () =>
    (partitionState.errorMsg = ''),
  clear: () =>
    (partitionState.data = [])
}

export const ajaxDemoCausalityChainPartition = 'ajaxDemoCausalityChainPartition'

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
const ret = establishControllerConnections({
  module,
  partition: { partitionName: ajaxDemoCausalityChainPartition, defaultState, controllerFunctions },
  controllerUIConnections
});
({ partitionState, setState, wrappedComponents } = ret)

export default wrappedComponents.AjaxDemoCausalityChain
