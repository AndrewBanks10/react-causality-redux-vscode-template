import { establishControllerConnections } from 'react-causality-redux'
import { defaultState, uiServiceFunctions, hotDisposeHandler } from './controller'
import { NewSourcesButtons, NewsContainer, ErrorMessage, LoaderNews, NewsForm } from './view'

const newsFormPartition = 'newsFormPartition'

const controllerUIConnections = [
  [
    LoaderNews, // React Component to wrap with redux connect
    newsFormPartition,
    [], // Function keys that you want passed into the props of the react component.
    ['isBusy'], // Partition keys that you want passed into the props of the react component.
    'LoaderNews' // Name of the react component string form
  ],
  [
    ErrorMessage,
    newsFormPartition,
    ['clearError'],
    ['errorMsg'],
    'ErrorMessage'
  ],
  [
    NewsContainer,
    newsFormPartition,
    ['closeNews'],
    ['newsObj'],
    'NewsContainer'
  ],
  [
    NewSourcesButtons,
    newsFormPartition,
    ['getNewsSources', 'clear'],
    ['isBusy'],
    'NewSourcesButtons'
  ],
  [
    NewsForm,
    newsFormPartition,
    ['getNews'],
    ['newsSources', 'NewsContainer', 'ErrorMessage', 'LoaderNews', 'NewSourcesButtons'],
    'NewsForm'
  ]
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
