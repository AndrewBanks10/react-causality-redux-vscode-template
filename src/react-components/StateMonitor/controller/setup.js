import { establishControllerConnections } from 'react-causality-redux'
import MonitorComponent from '../view/view'
import { defaultState, uiServiceFunctions } from './core'
import { handleTSSourceMaps } from './sourcemaps'

const stateMonitorPartition = 'stateMonitorPartition'

const { setState, getState, wrappedComponents } = establishControllerConnections({
  module,
  partition: { partitionName: stateMonitorPartition, defaultState, uiServiceFunctions },
  uiComponent: MonitorComponent,
  uiComponentName: 'MonitorComponent'
})

export { setState, getState, stateMonitorPartition, handleTSSourceMaps }
export default wrappedComponents.MonitorComponent
