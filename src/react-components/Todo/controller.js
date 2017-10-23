import CausalityRedux from 'causality-redux';
import {Todo, TodoForm, TodoEdit, ToDoItem, TodoList, InplaceTextEdit} from './view';
import { fetch, save } from './model';
import { FILTER_ALL } from './filters.js';

const todos = fetch();
const nextIndex = todos.reduce((accum, entry) => accum < entry.id ? entry.id : accum, 0) + 1;

const hasCompleted = (arr) =>
    arr.filter(entry => entry.completed).length > 0; 

const numOutstanding = (arr) =>
    arr.filter(entry => !entry.completed).length; 

const defaultState = {
    nextIndex,
    todos,
    text: '',
    editText: '',
    editID: -1,
    filter: FILTER_ALL,
    hasCompleted: hasCompleted(todos),
    numOutstanding: numOutstanding(todos)
};

const saveTodos = (todos) => {
    setState({ editID: -1, text: '', editText: '', todos, hasCompleted: hasCompleted(todos), numOutstanding: numOutstanding(todos) });
    save(todos);
};

const saveTodoEdit = (arr, text, id) => {
    if (text === '')
        return;    
    if (typeof id === 'undefined')
        arr.push({ text: text, id: partitionState.nextIndex++, completed: false });
    else
        arr[findTodo(arr, id)].text = text;
    saveTodos(arr);
};

const findTodo = (todos, id) =>
    todos.findIndex(e => e.id === id);

const controllerFunctions = {
    clearCompleted: () =>
        saveTodos(partitionState.todos.filter(entry => !entry.completed)),
    updateText: (text) =>
        partitionState.text = text.trim(),
    updateEditText: (text) =>
        partitionState.editText = text.trim(),
    saveTodo: () =>
        saveTodoEdit(partitionState.todos, partitionState.text),
    saveEdit: (id) =>
        saveTodoEdit(partitionState.todos, partitionState.editText, id),
    onCheck: (id) => {
        const arr = partitionState.todos;
        const index = findTodo(arr, id);
        arr[index].completed = !arr[index].completed;
        saveTodos(arr);
    },
    startEdit: (id) => {
        const arr = partitionState.todos;
        setState({editText: arr[findTodo(arr, id)].text, editID: id});
    },
    endEdit: () =>
        setState({ editText: '', editID: -1 }),
    deleteTodo: (id) =>
        saveTodos(partitionState.todos.filter(entry => entry.id !== id)),
    setFilter: (filter) =>
        partitionState.filter = filter
};

export const Todo_Partition = 'Todo_Partition';

const controllerUIConnections = [
    [InplaceTextEdit, Todo_Partition, ['updateEditText', 'saveEdit', 'endEdit'], ['editText', 'editID'], 'InplaceTextEdit'],
    [ToDoItem, Todo_Partition, ['deleteTodo', 'onCheck', 'startEdit'], ['editID', 'InplaceTextEdit'], 'ToDoItem'],
    [TodoList, Todo_Partition, [], ['todos', 'ToDoItem'], 'TodoList'],
    [TodoEdit, Todo_Partition, ['saveTodo', 'updateText', 'clearCompleted'], ['text', 'hasCompleted', 'numOutstanding'], 'TodoEdit'],
    [TodoForm, Todo_Partition, [], ['TodoEdit', 'TodoList'], 'TodoForm'],
    [Todo,     Todo_Partition, ['setFilter'], ['TodoForm', 'filter'], 'Todo']
];

const { partitionState, setState } = CausalityRedux.establishControllerConnections({
    module, 
    partition: { partitionName: Todo_Partition, defaultState, controllerFunctions },
    controllerUIConnections
});

export default partitionState.Todo;

