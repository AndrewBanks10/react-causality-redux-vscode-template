import { createStore, applyMiddleware } from 'redux'
import CausalityRedux from 'causality-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducersObject from './reducers'

export default function configureStore (preloadedState) {
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

// Opt out of hmr or this module will reload.
if (module.hot) {
  module.hot.decline()
}
