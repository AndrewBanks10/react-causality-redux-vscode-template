import { React, render, App, reactMountNode } from './index-common'
import { AppContainer } from 'react-hot-loader'

//
// The below is the necessary technique to utilize hot re-loading of react.
//
const renderRoot = (TheApp) => {
  render(
    <AppContainer warnings={false}>
      <TheApp />
    </AppContainer>,
    reactMountNode
  )
}

// First module render.
renderRoot(App)

//
// Hot reload support for react. If any of the react components change this will
// hot reload all changed components and then re-render the root
//
if (module.hot) {
  module.hot.accept('./index-common', () => {
    // The below requires the location of App or whatever is used for the root component
    // The require('./index-common') brings in a new copy of the App module.
    // react will handle keeping the props and state the same after the load.
    renderRoot(require('./index-common').default)
  })
}
