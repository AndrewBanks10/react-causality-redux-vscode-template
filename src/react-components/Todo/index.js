import { establishControllerConnections } from 'react-causality-redux'
import { defaultState, uiServiceFunctions } from './controller'
import { Todo, TodoForm, TodoEdit, ToDoItem, TodoList, InplaceTextEdit } from './view'

export const todoPartition = 'todoPartition'

const controllerUIConnections = [
  {
    uiComponent: InplaceTextEdit,
    partitionName: todoPartition,
    changerKeys: ['updateEditText', 'saveEdit', 'endEdit'],
    storeKeys: ['editText', 'editID'],
    uiComponentName: 'InplaceTextEdit'
  },
  {
    uiComponent: ToDoItem,
    partitionName: todoPartition,
    changerKeys: ['deleteTodo', 'onCheck', 'startEdit'],
    storeKeys: ['editID', 'InplaceTextEdit'],
    uiComponentName: 'ToDoItem'
  },
  {
    uiComponent: TodoList,
    partitionName: todoPartition,
    changerKeys: [],
    storeKeys: ['todos', 'ToDoItem'],
    uiComponentName: 'TodoList'
  },
  {
    uiComponent: TodoEdit,
    partitionName: todoPartition,
    changerKeys: ['saveTodo', 'updateText', 'clearCompleted'],
    storeKeys: ['text', 'hasCompleted', 'numOutstanding'],
    uiComponentName: 'TodoEdit'
  },
  {
    uiComponent: TodoForm,
    partitionName: todoPartition,
    changerKeys: [],
    storeKeys: ['TodoEdit', 'TodoList'],
    uiComponentName: 'TodoForm'
  },
  {
    uiComponent: Todo,
    partitionName: todoPartition,
    changerKeys: ['setFilter'],
    storeKeys: ['TodoForm', 'filter'],
    uiComponentName: 'Todo'
  }
]

const { partitionState, setState, wrappedComponents } = establishControllerConnections({
  module,
  partition: { partitionName: todoPartition, defaultState, uiServiceFunctions },
  controllerUIConnections
})

export { partitionState, setState }

export default wrappedComponents.Todo
