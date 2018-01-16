/* eslint no-undef: 0 */
/* eslint camelcase: 0 */
import { handleHMRLoadedModules } from './controller'

// Webpack particulars.
const chunkId = 0
const changedFileStart = '/***/'
const changedFileEnd = ':'
const hrmFileSuffix = '.hot-update.js'
const hrmEvent = 'webpackHotUpdate'

// From webpack, this is the url that contains the hmr changed code.
const hrmPatchURL = () =>
  __webpack_require__.p + '' + chunkId + '.' + __webpack_hash__ + hrmFileSuffix

// This is used to determine what file(s) have been updated with HMR
if (module.hot) {
  // Event sent on HMR.
  require('webpack/hot/emitter').on(hrmEvent, () => {
    // Get the patch from the webpack dev server
    fetch(hrmPatchURL()).then(response =>
      response.text()
    ).then(data => {
      try {
        // Find the file that was changed in the hmr patch.
        const start = data.indexOf(changedFileStart) + changedFileStart.length
        const end = data.indexOf(changedFileEnd)
        let changedFile = data.substring(start, end).trim().replace(/'|"/g, '')
        // Record the changed file,
        handleHMRLoadedModules([changedFile])
      } catch (msg) {
        throw new Error(`Hot patch parse failed ${msg}.`)
      }
    }).catch(function () {
      console.log(`fetch of ${hotURL} failed.`)
    })
  })
}
