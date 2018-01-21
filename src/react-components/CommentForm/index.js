import causalityRedux from 'causality-redux'
import { defaultState, uiServiceFunctions, initController } from './controller'
import { CommentList, CommentForm, CommentBoxDeleteForm, CommentBoxChangeForm, CommentBox } from './view'

// Comment partition entry
const commentBoxPartition = 'commentBoxPartition'

const controllerUIConnections = [
  {
    uiComponent: CommentList, // React Component to wrap with redux connect
    partitionName: commentBoxPartition,
    changerKeys: [], // Function keys that you want passed into the props of the react component.
    storeKeys: ['items'], // Partition keys that you want passed into the props of the react component.
    uiComponentName: 'CommentList' // Name of the react component string form
  },
  {
    uiComponent: CommentForm,
    partitionName: commentBoxPartition,
    changerKeys: ['onAuthorChange', 'onTextChange', 'onAddComment'],
    storeKeys: ['author', 'text'],
    uiComponentName: 'CommentForm'
  },
  {
    uiComponent: CommentBoxDeleteForm,
    partitionName: commentBoxPartition,
    changerKeys: ['onDeleteComment', 'onIdChange'],
    storeKeys: ['idToDelete'],
    uiComponentName: 'CommentBoxDeleteForm'
  },
  {
    uiComponent: CommentBoxChangeForm,
    partitionName: commentBoxPartition,
    changerKeys: ['onChangeComment', 'onIdChangeForChange', 'onAuthorChangeForChange'],
    storeKeys: ['idToChange', 'authorToChange'],
    uiComponentName: 'CommentBoxChangeForm'
  },
  {
    uiComponent: CommentBox,
    partitionName: commentBoxPartition,
    changerKeys: [],
    storeKeys: ['CommentList', 'CommentForm', 'CommentBoxDeleteForm', 'CommentBoxChangeForm'],
    uiComponentName: 'CommentBox'
  }
]

const { partitionState, setState, wrappedComponents, getState } = causalityRedux.establishControllerConnections({
  module,
  partition: { partitionName: commentBoxPartition, defaultState, uiServiceFunctions },
  controllerUIConnections
})

export { commentBoxPartition, partitionState, setState, getState }
export default wrappedComponents.CommentBox

// Perform controller initialization here that needs partitionState, setState or getState.
initController()
