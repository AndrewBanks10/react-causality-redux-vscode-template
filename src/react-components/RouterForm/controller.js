import { replaceHistory, historyGo, historyForward, historyBack } from './model'

import { partitionState } from './index'

/*
 Define the partition store definition
*/
export const defaultState = {
  currentUrl: '',
  goText: ''
}

export const controllerFunctions = {
  onChangeURL: (url) => {
    partitionState.currentUrl = url
  },
  changeURL: () => {
    replaceHistory(partitionState.currentUrl)
    partitionState.currentUrl = ''
  },
  onChangeGo: (goText) => {
    partitionState.goText = goText
  },
  onGo: () => {
    historyGo(partitionState.goText)
    partitionState.goText = ''
  },
  onForward: () => {
    historyForward()
  },
  onBack: () => {
    historyBack()
  }
}
