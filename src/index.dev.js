import React from 'react';
import { render } from 'react-dom';

// Include this if you have css files that are not cs modules.
// Otherwise, they will not be collected into the final css minimized build.
import 'css';

// Must be included before any react components
import './causality-redux/init';

import App from './react-components/app';
import { AppContainer } from 'react-hot-loader';

//
// The below is the necessary technique to utilize hot re-loading of react.
// 
const renderRoot = (TheApp) => {
  render(
    <AppContainer>
      <TheApp/>
    </AppContainer>,
    document.getElementById('reactroot')
  );
};

// First module render.
renderRoot(App);

//
// Hot reload support for react. If any of the react components change this will
// hot reload all changed components and then re-render the root
//
if (module.hot) {
    module.hot.accept('./react-components/app', () => {
        // The below requires the location of App or whatever is used for the root component
        // The require('./react-components/app') brings in a new copy of the App module.
        // react will handle keeping the props and state the same after the load. 
        renderRoot(require('./react-components/app').default);
    });
}
