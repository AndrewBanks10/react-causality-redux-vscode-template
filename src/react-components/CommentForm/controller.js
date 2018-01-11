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
