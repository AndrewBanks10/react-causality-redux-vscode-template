import { partitionState, setState } from './index'
import { handleGet, handleAbort } from './model'

export const defaultState = {
  data: [],
  spinnerCount: 0,
  error: '',
  getIsBusy: false
}

export const controllerFunctions = {
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
