import React from 'react'
import { reduxStore } from '../causality-redux/init'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import history from '../history/history'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import MainApp from './MainApp/MainApp'

const App = () =>
  <Provider store={reduxStore}>
    <Router history={history}>
      <MuiThemeProvider>
        <MainApp />
      </MuiThemeProvider>
    </Router>
  </Provider>

export default App
