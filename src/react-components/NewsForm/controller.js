import causalityRedux from 'causality-redux'
import { getSources, getNewsFromSource } from './model'
import { NewSourcesButtons, NewsContainer, ErrorMessage, LoaderNews, NewsForm } from './view'

//
// This module demonstrates the MVC controller to model and UI connection with a news reader.
//

let partitionState, setState, wrappedComponents

// This is for react mocha testing. Can't get clientHeight of the document.body in react mocha test mode.
const defaultHeight = 600
const defaultWidth = 600

const initialNewsObj = {
  news: [],
  window_x: 0,
  window_y: 0,
  newsSource: ''
}

const defaultState = {
  newsSources: [],
  errorMsg: '',
  isBusy: false,
  newsObj: initialNewsObj
}

//
// Define the controller functions that access the business code.
// These functions call into the business code and when results are available
// they are responsible for setting redux state partition values with those results.
//
const getNewsSources = () => {
  // This simple assignment will cause a busy indicator to display in the UI.
  partitionState.isBusy = true
  // Call into the business code.
  getSources(
    (sources) => { setState({ isBusy: false, newsSources: sources }) },
    (errorMsg) => { setState({ isBusy: false, errorMsg }) }
  )
}

const getNews = (source, name) => {
  partitionState.isBusy = true
  // Call into the business code.
  getNewsFromSource(
    source,
    name,
    (articles, name) => {
      const newsObj = setNewsObjDimensions()
      newsObj.news = articles
      newsObj.newsSource = name
      // This will turn off the busy indicator in the UI and display articles.
      setState({ isBusy: false, newsObj })
    },
    (errorMsg) => {
      // This will turn off the busy indicator in the UI and display an error message.
      setState({ isBusy: false, errorMsg })
    }
  )
}

const clearError = () => {
  partitionState.errorMsg = ''
}

const clear = () => {
  partitionState.newsSources = []
}

const closeNews = () => {
  partitionState.newsObj = initialNewsObj
}

const setNewsObjDimensions = () => {
  const newsObj = partitionState.newsObj
  // This is a hack for mocha testing with react and jsdom.
  // Does not support window.document.body.clientWidth/window.document.body.clientHeight
  const w = window.document.body.clientWidth
  newsObj.window_x = typeof w === 'undefined' ? defaultWidth : w

  const h = window.document.body.clientHeight
  newsObj.window_y = typeof h === 'undefined' ? defaultHeight : h
  return newsObj
}

const controllerFunctions =
{
  getNewsSources,
  getNews,
  closeNews,
  clearError,
  clear
}

export const newsFormPartition = 'newsFormPartition'

//
// Establish the connections of the store keys and function keys to the component props.
// This takes care of defining react-redux mapStateToProps, mapDispatchToProps and connect.
//
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

const handleWindowResize = () => {
  if (typeof partitionState !== 'undefined') {
    partitionState.newsObj = setNewsObjDimensions()
  }
}

// Handle window resizes in the controller
window.addEventListener('resize', handleWindowResize)

// Called just before hot re-load
const hotDisposeHandler = () => {
  window.removeEventListener('resize', handleWindowResize)
}

//
// Add the partition definition to CausalityRedux.
// module is needed to support hot reloading.
//
const ret = causalityRedux.establishControllerConnections({
  module,
  hotDisposeHandler,
  partition: { partitionName: newsFormPartition, defaultState, controllerFunctions },
  controllerUIConnections
});
({ partitionState, setState, wrappedComponents } = ret)

//
// This part of the controller wires state partition values and controller functions
// to the react components through the props.
//

export default wrappedComponents.NewsForm
