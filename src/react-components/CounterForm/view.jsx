import React from 'react'
import Paper from 'material-ui/Paper'
import AppBar from 'material-ui/AppBar'
import NavMenu from '../NavMenu'
import RaisedButton from 'material-ui/RaisedButton'
import styles from '../../stylesheets/CounterForm'

export const CounterFormValue = ({ counter }) =>
  <div className={styles['counter-form-value']}>
    {`Counter Display: ${counter}`}
  </div>

export const CounterForm = ({ increment, decrement, counter, CounterFormValue }) =>
  <div>
    <AppBar
      title='Counter Demo.'
      iconElementLeft={<NavMenu useHome={'useHome'} />}
    />
    <Paper zDepth={4}>
      <div className={styles['counter-form-text']}>Multiple child components are updated with one state change/event.</div>
      <div id='countertext' className={styles['counter-text']}>{`The current counter is ${counter}.`}</div>
      <CounterFormValue />
      <CounterFormValue />
      <RaisedButton id='onIncrement' className={styles['counter-form-button']} label='Up' onClick={increment} />
      <RaisedButton id='onDecrement' className={styles['counter-form-button']} label='Down' onClick={decrement} />
    </Paper>
  </div>
