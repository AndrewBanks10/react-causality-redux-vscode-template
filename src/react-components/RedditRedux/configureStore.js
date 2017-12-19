import { createStore, applyMiddleware } from 'redux'
import CausalityRedux from 'causality-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducersObject from './reducers'

const reduxLogging = true

let configureStore
if (!reduxLogging || process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'mochaTesting') {
  configureStore = function configureStore (preloadedState) {
    const reduxStore = createStore(
      // Note this usage
      CausalityRedux.combineReducers(reducersObject),
      preloadedState,
      applyMiddleware(
        thunkMiddleware
      )
    )
    return { reduxStore, reducersObject }
  }
} else {
  configureStore = function configureStore (preloadedState) {
    const loggerMiddleware = createLogger()
    const reduxStore = createStore(
      // Note this usage
      CausalityRedux.combineReducers(reducersObject),
      preloadedState,
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      )
    )
    return { reduxStore, reducersObject }
  }
}

export default configureStore

// Opt out of hmr or this module will reload.
if (module.hot) {
  module.hot.decline()
}
