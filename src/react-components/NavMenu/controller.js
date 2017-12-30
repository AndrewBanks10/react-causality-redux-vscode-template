import { partitionState, setState } from './index'

export const defaultState = {
  open: false,
  mochaTesting: false,
  anchorEl: null
}

export const controllerFunctions = {
  closeMenu: () => {
    partitionState.open = false
  },

  openMenu: (event) => {
    setState({ open: true, anchorEl: event.currentTarget })
  }
}
