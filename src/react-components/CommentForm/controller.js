import { partitionState, setState } from './index'

export const defaultState = {
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

export const uiServiceFunctions = {
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
    // Get a copy of the array items.
    const arr = partitionState.items
    const id = parseInt(partitionState.idToChange)
    const index = arr.findIndex(e => e.id === id)
    if (index >= 0) {
      // Note we have to change the pointer at arr[index] since arr[index] is an object (pointer).
      // Otherwise, with redux we do not have a state transition for this array item.
      arr[index] = { author: partitionState.authorToChange, text: arr[index].text, id: arr[index].id }
      // Now set the redux partition state. We have a copy of the array with arr
      // and a copy of the array item at index in arr which contains the new entry.
      setState({ idToChange: '', authorToChange: '', items: arr })
    }
  }
}
