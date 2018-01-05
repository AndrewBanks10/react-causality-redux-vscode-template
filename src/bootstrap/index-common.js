import './libs'
import React from 'react'
import { render } from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import './css'
import {globalPartitionState} from '../causality-redux/init'
import App from '../react-components/App'

if (!globalPartitionState.injectTapEventPlugin) {
  globalPartitionState.injectTapEventPlugin = true
  injectTapEventPlugin()
}

const reactRootId = 'reactroot'
const reactMountNode = document.getElementById(reactRootId)

export { App, React, render, reactMountNode }
export default App
