import React from 'react';
import { render } from 'react-dom';
import 'css';
import './causality-redux/init';
import App from './react-components/App';

const reactRootId = 'reactroot';
const reactMountNode = document.getElementById(reactRootId);

export { App, React, render, reactMountNode };
export default App;