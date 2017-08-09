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


/*
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app.jsx';

function pascal(n, arrAnswer) {
  if (n === 1) {
    arrAnswer.push([1]);
    return;
  }
  if (n === 2) {
    arrAnswer.push([1,1]);
    return;
  }

  pascal(n - 1, arrAnswer);
  const arrTos = arrAnswer[arrAnswer.length - 1];
  const newAnswer = [1];
  let j = 1;
  for (let i = 0; i < arrTos.length - 1; ++i)
    newAnswer[j++] = arrTos[i] + arrTos[i + 1];
  newAnswer.push(1);
  arrAnswer.push(newAnswer);
  
}

function pascal2(num, arrAnswer) {
  for (let n = 1; n <= num; ++n) {
    if (n === 1) {
      arrAnswer.push([1]);
    } else if (n === 2) {
      arrAnswer.push([1, 1]);
    } else {
      const arrTos = arrAnswer[arrAnswer.length - 1];
      const newAnswer = [1];
      let j = 1;
      for (let i = 0; i < arrTos.length - 1; ++i)
        newAnswer[j++] = arrTos[i] + arrTos[i + 1];
      newAnswer.push(1);
      arrAnswer.push(newAnswer);
    }  
  }  
  
}

let arrAnswer = [];
pascal(5, arrAnswer);

arrAnswer = [];
pascal2(5, arrAnswer);

let str = 'the dog went to the store';

str = str.split(' ').reverse().join(' ').split('').reverse().join('');

const pali = str =>
  str === str.split('').reverse().join('');

let bbb = pali('bob');
bbb = pali('bob1');


// The below is the necessary technique to utilize hot re-loading of react.
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
// Hot reload support for react. If any of the react components change, the below will
// hot reload all changed components and then re-render the root
//
if (module.hot) {
    module.hot.accept('./app.jsx', () => {
        // The below requires the location of App or whatever is used for the root component
        // The require('./app.jsx') brings in a new copy of the App module.
        // React will handle keeping the props the same after the load. 
        renderRoot(require('./app.jsx').default);
    });
}
*/