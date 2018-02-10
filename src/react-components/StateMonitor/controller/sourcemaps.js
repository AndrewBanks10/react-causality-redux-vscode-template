import { loadSourceMaps, mapModule } from '../model/sourcemaps'
import { allStates } from './core'

export const mapModulesOnStack = stack => {
  for (let i = 0; i < stack.length; ++i) {
    stack[i] = mapModule(stack[i])
  }
  return stack
}

// Typescript does not translate the error stack line numbers correctly.
// So, we have to do this translation for now.
// Translate all ts modules on the stack that have not been translated.
const handleTSSourceMapsComplete = () => {
  const len = allStates.length
  for (let i = 0; i < len; ++i) {
    if (typeof allStates[i].callStack !== 'undefined') {
      const tos = allStates[i].callStack.length - 1
      if (allStates[i].callStack[tos].moduleName && !allStates[i].callStack[tos].translated) {
        allStates[i].callStack = mapModulesOnStack(allStates[i].callStack)
      }
    }
  }
}

export const handleTSSourceMaps = () =>
  loadSourceMaps(handleTSSourceMapsComplete)
