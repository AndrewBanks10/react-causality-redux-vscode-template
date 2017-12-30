import { fetch, save } from './model'
import { FILTER_ALL } from './filters.js'
import { partitionState, setState } from './index'

const todos = fetch()
const nextIndex = todos.reduce((accum, entry) => accum < entry.id ? entry.id : accum, 0) + 1

const hasCompleted = (arr) =>
  arr.filter(entry => entry.completed).length > 0

const numOutstanding = (arr) =>
  arr.filter(entry => !entry.completed).length

export const defaultState = {
  nextIndex,
  todos,
  text: '',
  editText: '',
  editID: -1,
  filter: FILTER_ALL,
  hasCompleted: hasCompleted(todos),
  numOutstanding: numOutstanding(todos)
}

const saveTodos = (todos) => {
  setState({ editID: -1, text: '', editText: '', todos, hasCompleted: hasCompleted(todos), numOutstanding: numOutstanding(todos) })
  save(todos)
}

const saveTodoEdit = (arr, text, id) => {
  if (text === '') {
    return
  }
  if (typeof id === 'undefined') {
    arr.push({ text: text, id: partitionState.nextIndex++, completed: false })
  } else {
    arr[findTodo(arr, id)].text = text
  }
  saveTodos(arr)
}

const findTodo = (todos, id) =>
  todos.findIndex(e => e.id === id)

export const controllerFunctions = {
  clearCompleted: () =>
    saveTodos(partitionState.todos.filter(entry => !entry.completed)),
  updateText: (text) =>
    (partitionState.text = text.trim()),
  updateEditText: (text) =>
    (partitionState.editText = text.trim()),
  saveTodo: () =>
    saveTodoEdit(partitionState.todos, partitionState.text),
  saveEdit: (id) =>
    saveTodoEdit(partitionState.todos, partitionState.editText, id),
  onCheck: (id) => {
    const arr = partitionState.todos
    const index = findTodo(arr, id)
    arr[index].completed = !arr[index].completed
    saveTodos(arr)
  },
  startEdit: (id) => {
    const arr = partitionState.todos
    setState({editText: arr[findTodo(arr, id)].text, editID: id})
  },
  endEdit: () =>
    setState({ editText: '', editID: -1 }),
  deleteTodo: (id) =>
    saveTodos(partitionState.todos.filter(entry => entry.id !== id)),
  setFilter: (filter) =>
    (partitionState.filter = filter)
}
