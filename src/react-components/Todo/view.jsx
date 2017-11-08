import React from 'react'
import styles from './view.scss'
import Paper from 'material-ui/Paper'
import { Tabs, Tab } from 'material-ui/Tabs'
import TextField from 'material-ui/TextField'
import Checkbox from 'material-ui/Checkbox'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import ContentClear from 'material-ui/svg-icons/content/clear'
import AppBar from 'material-ui/AppBar'
import NavMenu from '../../react-components/NavMenu/controller'
import { FILTER_ALL, FILTER_ACTIVE, FILTER_COMPLETE } from './filters.js'

const RED = 'RGB(255,0,0)'
const ENTERKEY = 'Enter'
const TITLEDELETETODO = 'Delete todo.'
const TITLENEWTODO = 'Type new todo.'
const TITLECLEARCOMPLETED = 'Clear Completed Todos.'
const TITLEITEMSLEFT = 'items left'
const TITLEEDITTODO = 'Double click to edit todo.'

export class InplaceTextEdit extends React.Component {
  componentDidMount () {
    this.nameInput.focus()
  }
  render () {
    const { editText, updateEditText, saveEdit, endEdit, editID } = this.props
    return (
      <TextField
        ref={(input) => { this.nameInput = input }}
        id={editID.toString()}
        onChange={e => updateEditText(e.target.value)}
        value={editText}
        onBlur={endEdit}
        onKeyPress={e => e.key === ENTERKEY ? saveEdit(editID) : {}}
        className={styles.TextField}
      />
    )
  }
}

export const ToDoItem = ({ id, completed, text, deleteTodo, onCheck, startEdit, editID, InplaceTextEdit }) => {
  if (editID === id) {
    return (
      <div className={styles.TodoEditItem}>
        <InplaceTextEdit />
      </div>
    )
  }
  return (
    <div className={styles.TodoItem}>
      <div className={styles.ItemCheckbox}><Checkbox checked={completed} onCheck={() => onCheck(id)} /></div>
      <div className={completed ? styles.ItemTextCompleted : styles.ItemText} onDoubleClick={() => startEdit(id)} title={TITLEEDITTODO}>{text}</div>
      <div className={styles.ItemDelete} title={TITLEDELETETODO}>
        <ActionDelete color={RED} onClick={() => deleteTodo(id)} />
      </div>
      <div className={styles.FloatClear} />
    </div>
  )
}

export const TodoList = ({ filter, todos, ToDoItem }) =>
  <div>
    {todos.map(todo => {
      if ((filter === FILTER_ALL) || (todo.completed && (filter === FILTER_COMPLETE)) || (!todo.completed && (filter === FILTER_ACTIVE))) {
        return (
          <ToDoItem
            key={todo.id}
            id={todo.id}
            completed={todo.completed}
            text={todo.text}
          />
        )
      }
      return null
    })}
  </div>

const textFieldStyle = { width: '100%' }
export const TodoEdit = ({ hasCompleted, numOutstanding, text, saveTodo, updateText, clearCompleted }) =>
  <div className={styles.TodoEdit}>
    <div className={styles.TextFieldContainer}>
      <TextField
        hintText={TITLENEWTODO}
        onChange={e => updateText(e.target.value)}
        value={text}
        onKeyPress={e => e.key === ENTERKEY ? saveTodo() : {}}
        style={textFieldStyle}
      />
    </div>
    <div className={styles.FloatRight}>
      <div onClick={clearCompleted} title={TITLECLEARCOMPLETED} className={hasCompleted ? styles.ClearCompleted : styles.ClearCompletedOff}>
        <ContentClear />
      </div>
      <div className={styles.Outstanding}>
        {`${numOutstanding} ${TITLEITEMSLEFT}`}
      </div>
    </div>
    <div className={styles.FloatClear} />
  </div>

export const TodoForm = ({ filter, TodoEdit, TodoList }) =>
  <div>
    <TodoEdit />
    <TodoList filter={filter} />
  </div>

export const Todo = ({ setFilter, TodoForm, filter }) =>
  <div>
    <AppBar
      title='Demonstrates a Todo app.'
      iconElementLeft={<NavMenu useHome={'useHome'} />}
    />
    <div className={styles.mainSection}>
      <Paper zDepth={4} className={styles.mainSection2}>
        <div className={styles.mainHeader}>todos</div>
        <Tabs value={filter}>
          <Tab value={FILTER_ALL} label={FILTER_ALL} onActive={() => setFilter(FILTER_ALL)}>
            {filter === FILTER_ALL ? <TodoForm filter={FILTER_ALL} /> : <div />}
          </Tab>
          <Tab value={FILTER_ACTIVE} label={FILTER_ACTIVE} onActive={() => setFilter(FILTER_ACTIVE)}>
            {filter === FILTER_ACTIVE ? <TodoForm filter={FILTER_ACTIVE} /> : <div />}
          </Tab>
          <Tab value={FILTER_COMPLETE} label={FILTER_COMPLETE} onActive={() => setFilter(FILTER_COMPLETE)}>
            {filter === FILTER_COMPLETE ? <TodoForm filter={FILTER_COMPLETE} /> : <div />}
          </Tab>
        </Tabs>
      </Paper>
    </div >
  </div>
