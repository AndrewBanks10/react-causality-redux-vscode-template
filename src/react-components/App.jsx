import React from 'react';
import CausalityRedux from 'causality-redux';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'react-causality-redux-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MainApp from './MainApp/MainApp';

// Causality-redux requires Router instead of BrowserRouter because of the internally generated history by CR
// BrowserRouter internally creates its own history
// MuiThemeProvider is required by material-ui
// Provider is needed by react-redux.
const App = () =>
    <Provider store={CausalityRedux.store}>
        <Router history={createBrowserHistory()}>
            <MuiThemeProvider>
                <MainApp/>
            </MuiThemeProvider>
        </Router>    
    </Provider>;

export default App;
