import * as React from 'react'

// Set this to false to turn off the monitor.
const showMonitor = true

let StateMonitor
let handleTSSourceMaps
if (!showMonitor || process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'mochaTesting') {
  class NullComponent extends React.Component {
    render () {
      return null
    }
  }
  StateMonitor = NullComponent
  handleTSSourceMaps = () => { }
} else {
  const controller = require('./controller')
  StateMonitor = controller.default
  handleTSSourceMaps = controller.handleTSSourceMaps
}

export { StateMonitor, handleTSSourceMaps }
