import { handleHMRLoadedModules } from './controller'

const webpackHotUpdate = 'webpackHotUpdate'
if (module.hot) {
  const parentHotUpdateCallback = window[webpackHotUpdate]
  // Webpack uses window[webpackHotUpdate] as the function to call on a hmr.
  // So, save that function and replace it with one of our own so we
  // can determine which module source files changed. Then
  // call the webpack function that was saved.
  window[webpackHotUpdate] =
    function webpackHotUpdateCallback (chunkId, moreModules) {
      // Call the webpack hrm handler.
      if (typeof parentHotUpdateCallback === 'function') {
        parentHotUpdateCallback(chunkId, moreModules)
      }
      // Now handle the changed source modules.
      handleHMRLoadedModules(Object.keys(moreModules))
    }
}
