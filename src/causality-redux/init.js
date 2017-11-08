import CausalityRedux from 'causality-redux'
import 'react-causality-redux'

// Use this if you need global data. It survives HMR if you use globalStore to access and change it.
const globalData = {
  injectTapEventPlugin: false
}

CausalityRedux.createStore({partitionName: CausalityRedux.globalDataKey, defaultState: globalData})
const globalStore = CausalityRedux.store[CausalityRedux.globalDataKey]

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

export { globalPartitionState, globalSetState, globalGetState, globalSubscribe }
