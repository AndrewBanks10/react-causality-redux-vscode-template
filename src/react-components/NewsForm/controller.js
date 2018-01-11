import { partitionState, setState } from './index'
import { getSources, getNewsFromSource } from './model'

// This is for react mocha testing. Can't get clientHeight of the document.body in react mocha test mode.
const defaultHeight = 600
const defaultWidth = 600

const initialNewsObj = {
  news: [],
  window_x: 0,
  window_y: 0,
  newsSource: ''
}

export const defaultState = {
  newsSourcesCache: [],
  newsSources: [],
  errorMsg: '',
  isBusy: false,
  newsObj: initialNewsObj
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

export const uiServiceFunctions = {
  getNewsSources: () => {
    // Cache
    if (partitionState.newsSources.length > 0) {
      return
    } else if (partitionState.newsSourcesCache.length > 0) {
      partitionState.newsSources = partitionState.newsSourcesCache
      return
    }
    // This simple assignment will cause a busy indicator to display in the UI.
    partitionState.isBusy = true
    // Call into the business code.
    getSources(
      sources => { setState({ isBusy: false, newsSources: sources, newsSourcesCache: sources }) },
      errorMsg => { setState({ isBusy: false, errorMsg }) }
    )
  },
  getNews: (source, name) => {
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
  },
  closeNews: () => {
    partitionState.newsObj = initialNewsObj
  },
  clearError: () => {
    partitionState.errorMsg = ''
  },
  clear: () => {
    partitionState.newsSources = []
  }
}

const handleWindowResize = () => {
  if (typeof partitionState !== 'undefined') {
    partitionState.newsObj = setNewsObjDimensions()
  }
}

// Handle window resizes in the controller
window.addEventListener('resize', handleWindowResize)

// Called just before hot re-load
export const hotDisposeHandler = () => {
  window.removeEventListener('resize', handleWindowResize)
}
