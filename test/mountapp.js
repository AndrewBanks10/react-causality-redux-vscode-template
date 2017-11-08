import 'core-js/es6/map'
import 'core-js/es6/set'

import React from 'react'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '../src/css'
import '../src/causality-redux/init'
import App from '../src/react-components/App'

configure({ adapter: new Adapter() })

// Mount the App
const appMount = mount(<App />)

export default appMount
