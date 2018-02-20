
import { React, App } from '../src/bootstrap/index-common'
import Adapter from 'enzyme-adapter-react-16'
import { configure, mount } from 'enzyme'

configure({ adapter: new Adapter() })

// Mount the App
const appMount = mount(<App />)

export default appMount
