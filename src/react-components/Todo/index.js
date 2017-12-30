import { establishControllerConnections } from 'react-causality-redux'
import { defaultState, controllerFunctions } from './controller'
import { Todo, TodoForm, TodoEdit, ToDoItem, TodoList, InplaceTextEdit } from './view'

export const todoPartition = 'todoPartition'

const controllerUIConnections = [
  [InplaceTextEdit, todoPartition, ['updateEditText', 'saveEdit', 'endEdit'], ['editText', 'editID'], 'InplaceTextEdit'],
  [ToDoItem, todoPartition, ['deleteTodo', 'onCheck', 'startEdit'], ['editID', 'InplaceTextEdit'], 'ToDoItem'],
  [TodoList, todoPartition, [], ['todos', 'ToDoItem'], 'TodoList'],
  [TodoEdit, todoPartition, ['saveTodo', 'updateText', 'clearCompleted'], ['text', 'hasCompleted', 'numOutstanding'], 'TodoEdit'],
  [TodoForm, todoPartition, [], ['TodoEdit', 'TodoList'], 'TodoForm'],
  [Todo, todoPartition, ['setFilter'], ['TodoForm', 'filter'], 'Todo']
]

const { partitionState, setState, wrappedComponents } = establishControllerConnections({
  module,
  partition: { partitionName: todoPartition, defaultState, controllerFunctions },
  controllerUIConnections
})

export { partitionState, setState }

export default wrappedComponents.Todo
