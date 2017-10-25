import React from 'react';
import { mount } from 'enzyme';
import '../src/css';
import '../src/causality-redux/init';
import App from '../src/react-components/App';
    
// Mount the App
const appMount = mount(<App />);

export default appMount;