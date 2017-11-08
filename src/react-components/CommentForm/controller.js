import CausalityRedux from 'causality-redux'
import { CommentList, CommentForm, CommentBoxDeleteForm, CommentBoxChangeForm, CommentBox } from './view'

const defaultState = {
  items: [],
  author: '',
  text: '',
  idToDelete: '',
  idToChange: '',
  authorToChange: '',
  nextIndex: 0
}

const digitsOnly = (str) =>
  str.replace(/\D/g, '')

const controllerFunctions = {
  onResetAuthorDefault: () =>
    (partitionState.author = ''),
  onAuthorChange: (author) =>
    (partitionState.author = author),
  onTextChange: (text) =>
    (partitionState.text = text),
  onIdChange: (idToDelete) =>
    (partitionState.idToDelete = digitsOnly(idToDelete)),
  onIdChangeForChange: (idToChange) =>
    (partitionState.idToChange = digitsOnly(idToChange)),
  onAuthorChangeForChange: (authorToChange) =>
    (partitionState.authorToChange = authorToChange),
  onAddComment: ({ author, text }) => {
    const arr = partitionState.items
    arr.push({ author, text, id: partitionState.nextIndex++ })
    setState({ author: '', text: '', items: arr })
  },
  onDeleteComment: () => {
    const arr = partitionState.items
    const id = parseInt(partitionState.idToDelete)
    setState({ idToDelete: '', items: arr.filter(e => e.id !== id) })
  },
  onChangeComment: () => {
    const arr = partitionState.items
    const id = parseInt(partitionState.idToChange)
    const index = arr.findIndex(e => e.id === id)
    if (index >= 0) {
      // Note we have to change the pointer at rr[index].
      arr[index] = { author: partitionState.authorToChange, text: arr[index].text, id: arr[index].id }
      setState({ idToChange: '', authorToChange: '', items: arr })
    }
  }
}

// Comment partition entry
export const commentBoxPartition = 'commentBoxPartition'

const controllerUIConnections = [
  [
    CommentList, // React Component to wrap with redux connect
    commentBoxPartition,
    [], // Function keys that you want passed into the props of the react component.
    ['items'], // Partition keys that you want passed into the props of the react component.
    'CommentList' // Name of the react component string form
  ],
  [
    CommentForm, // Wrapped component
    commentBoxPartition,
    ['onAuthorChange', 'onTextChange', 'onAddComment'],
    ['author', 'text'],
    'CommentForm'
  ],
  [
    CommentBoxDeleteForm, // Wrapped component
    commentBoxPartition,
    ['onDeleteComment', 'onIdChange'],
    ['idToDelete'],
    'CommentBoxDeleteForm'
  ],
  [
    CommentBoxChangeForm, // Wrapped component
    commentBoxPartition,
    ['onChangeComment', 'onIdChangeForChange', 'onAuthorChangeForChange'],
    ['idToChange', 'authorToChange'],
    'CommentBoxChangeForm'
  ],
  [
    CommentBox, // Wrapped component
    commentBoxPartition,
    [],
    ['CommentList', 'CommentForm', 'CommentBoxDeleteForm', 'CommentBoxChangeForm'],
    'CommentBox'
  ]
]

const { partitionState, setState, wrappedComponents } = CausalityRedux.establishControllerConnections({
  module,
  partition: { partitionName: commentBoxPartition, defaultState, controllerFunctions },
  controllerUIConnections
})

export default wrappedComponents.CommentBox

// Put in some initial comments.
if (CausalityRedux.store[commentBoxPartition].getState().items.length === 0) {
  const initialComments = [
    {author: 'Cory Brown', text: 'My 2 scents'},
    {author: 'Jared Anderson', text: 'Let me put it this way. You`ve heard of Socrates? Aristotle? Plato? Morons!'},
    {author: 'Matt Poulson', text: 'It`s just a function!'},
    {author: 'Bruce Campbell', text: 'Fish in a tree? How can that be?'}
  ]

  initialComments.forEach(comment => CausalityRedux.store[commentBoxPartition].onAddComment(comment))
}
