import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import CausalityRedux from 'causality-redux';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import history from '../history/history';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MainApp from './MainApp/MainApp';

const App = () =>
    <Provider store={CausalityRedux.store}>
        <Router history={history}>
            <MuiThemeProvider>
                <MainApp/>
            </MuiThemeProvider>
        </Router>
    </Provider>;

export default App;