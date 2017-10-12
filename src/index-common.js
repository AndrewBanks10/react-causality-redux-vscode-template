
import React from 'react';
import { render } from 'react-dom';

// Include this if you have css files that are not cs modules.
// Otherwise, they will not be collected into the final css minimized build.
import 'css';

// CausalityRedux.createStore must be included before any react components
import './causality-redux/init';
import App from './react-components/App';

export { App, React, render };
export default App;    

