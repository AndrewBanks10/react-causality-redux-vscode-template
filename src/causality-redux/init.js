import causalityRedux from 'causality-redux'
import 'react-causality-redux'
import configureStore from '../react-components/RedditRedux/configureStore'

// Use this if you need global data. It survives HMR if you use globalStore to access and change it.
const globalData = {
  injectTapEventPlugin: false
}

// Create the redux store.
const { reduxStore, reducersObject } = configureStore()

// This must be called here in order to create the causalityRedux store.
causalityRedux.setReduxStore(reduxStore, reducersObject)

causalityRedux.addPartitions({partitionName: causalityRedux.globalDataKey, defaultState: globalData})
const globalStore = causalityRedux.store[causalityRedux.globalDataKey]

export default globalStore
// globalPartitionState - Access and set individual key values in the global store.
const globalPartitionState = globalStore.partitionState
// globalSetState = Set multiple key values in the global store.
const globalSetState = globalStore.setState
// globalGetState - Get global store object.
const globalGetState = globalStore.getState
// globalSubscribe - Subscribe to changes to key values in the global store.
// globalSubscribe(listener: function, globalStoreKeys = [], listenerName = '')
// If globalStoreKeys == [] or undefined, listen to all keys in the global partition.
const globalSubscribe = globalStore.subscribe

export { globalPartitionState, globalSetState, globalGetState, globalSubscribe, reduxStore }
