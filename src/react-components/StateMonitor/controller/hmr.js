import causalityRedux from 'causality-redux'
import { allStates } from './core'

const isCausalityReduxComponent = val =>
  typeof val === 'function' && val.prototype !== 'undefined' && typeof val.prototype.isCausalityReduxComponent !== 'undefined'

export const copyHotReloadedComponents = (partitionName, partition) => {
  causalityRedux.getKeys(partition).forEach(partitionKey => {
    if (isCausalityReduxComponent(partition[partitionKey])) {
      allStates.forEach(entry => {
        if (typeof entry.store !== 'undefined' &&
          typeof entry.store[partitionName] !== 'undefined' &&
          typeof entry.store[partitionName][partitionKey] !== 'undefined'
        ) {
          entry.store[partitionName][partitionKey] = partition[partitionKey]
        }
      })
      delete partition[partitionKey]
    }
  })
}

// If a module has been HMR loaded then its source on the stack is invalid.
export const handleHMRLoadedModules = changedSourceModules => {
  const len = allStates.length
  for (let i = 0; i < len; ++i) {
    if (typeof allStates[i].callStack !== 'undefined') {
      allStates[i].callStack.forEach(stackEntry => {
        if (stackEntry.moduleName && stackEntry.moduleName !== 'Unknown') {
          if (changedSourceModules.some(e => stackEntry.moduleName === e)) {
            stackEntry.moduleName = 'Unknown'
          }
        }
      })
    }
  }
}
