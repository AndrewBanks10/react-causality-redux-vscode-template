import { establishControllerConnections } from 'react-causality-redux'
import { defaultState, uiServiceFunctions } from './controller'
import NavMenu from './view'

const navMenuPartition = 'navMenuPartition'

const { partitionState, setState, wrappedComponents } = establishControllerConnections({
  module, // Needed for hot reloading.
  partition: { partitionName: navMenuPartition, defaultState, uiServiceFunctions },
  uiComponent: NavMenu, // Redux connect will be called on this component and returned as uiComponent in the returned object.
  uiComponentName: 'NavMenu' // Used for tracing.
})

// This is required because of a bug in material-ui with mocha/enzyme testing.
if (process.env.NODE_ENV === 'mochaTesting' || process.env.NODE_ENV === 'mochaDebugTesting') {
  partitionState.mochaTesting = true
}

export { navMenuPartition, partitionState, setState }
// Export the redux connect component. Use this in parent components.
export default wrappedComponents.NavMenu
