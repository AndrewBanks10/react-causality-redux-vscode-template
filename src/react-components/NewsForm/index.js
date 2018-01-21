import { establishControllerConnections } from 'react-causality-redux'
import { defaultState, uiServiceFunctions, hotDisposeHandler } from './controller'
import { NewSourcesButtons, NewsContainer, ErrorMessage, LoaderNews, NewsForm } from './view'

const newsFormPartition = 'newsFormPartition'

const controllerUIConnections = [
  {
    uiComponent: LoaderNews, // React Component to wrap with redux connect
    partitionName: newsFormPartition,
    changerKeys: [], // Function keys that you want passed into the props of the react component.
    storeKeys: ['isBusy'], // Partition keys that you want passed into the props of the react component.
    uiComponentName: 'LoaderNews' // Name of the react component string form
  },
  {
    uiComponent: ErrorMessage,
    partitionName: newsFormPartition,
    changerKeys: ['clearError'],
    storeKeys: ['errorMsg'],
    uiComponentName: 'ErrorMessage'
  },
  {
    uiComponent: NewsContainer,
    partitionName: newsFormPartition,
    changerKeys: ['closeNews'],
    storeKeys: ['newsObj'],
    uiComponentName: 'NewsContainer'
  },
  {
    uiComponent: NewSourcesButtons,
    partitionName: newsFormPartition,
    changerKeys: ['getNewsSources', 'clear'],
    storeKeys: ['isBusy'],
    uiComponentName: 'NewSourcesButtons'
  },
  {
    uiComponent: NewsForm,
    partitionName: newsFormPartition,
    changerKeys: ['getNews'],
    storeKeys: ['newsSources', 'NewsContainer', 'ErrorMessage', 'LoaderNews', 'NewSourcesButtons'],
    uiComponentName: 'NewsForm'
  }
]

//
// Add the partition definition to CausalityRedux.
// module is needed to support hot reloading.
//
const { partitionState, setState, wrappedComponents } = establishControllerConnections({
  module,
  hotDisposeHandler,
  partition: { partitionName: newsFormPartition, defaultState, uiServiceFunctions },
  controllerUIConnections
})

export { partitionState, setState }

export default wrappedComponents.NewsForm
