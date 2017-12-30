import { establishControllerConnections } from 'react-causality-redux'
import { defaultState, controllerFunctions } from './controller'
import RouterForm from './view'

const routerFormPartition = 'routerFormPartition'

const { partitionState, wrappedComponents } = establishControllerConnections({
  module, // Needed for hot reloading.
  partition: { partitionName: routerFormPartition, defaultState, controllerFunctions },
  uiComponent: RouterForm, // Redux connect will be called on this component and returned as uiComponent in the returned object.
  uiComponentName: 'RouterForm' // Used for tracing.
})

export { partitionState }

// Export the redux connect component. Use this in parent components.
export default wrappedComponents.RouterForm
