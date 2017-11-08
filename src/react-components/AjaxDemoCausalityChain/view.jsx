import React from 'react'
import Paper from 'material-ui/Paper'
import AppBar from 'material-ui/AppBar'
import NavMenu from '../NavMenu/controller'
import RaisedButton from 'material-ui/RaisedButton'

//
// This is a css injection because this component is an independent react web component.
// Injections must be in files named, name.inject.css, name.inject.scss, name.inject.sass
// or name.inject.less. The injection will not be part of the final css of the project.
//
import styles from './view.inject'

export const Loader1 = ({getIsBusy}) => {
  let className = ''
  if (getIsBusy) {
    className = styles.loader
  }
  return (
    <div className={className} />
  )
}

export const ErrorMessage = ({ error, clearError }) => {
  if (error === '') {
    return null
  }
  return (
    <div className={`${styles['center-div-on-screen']} ${styles['error-message']}`}>
      <div className={styles['error-message-text']}>{error}</div>
      <br />
      <button onClick={() => clearError()}>OK</button>
    </div>
  )
}

export const AjaxDemoCausalityChain = ({ onGet, onAbortGet, clear, data, getIsBusy, Loader1, ErrorMessage }) => {
  const tlist = data.map((o) => {
    return (
      <tr key={o.id}>
        <td>{o.userId}</td>
        <td>{o.id}</td>
        <td>{o.title}</td>
        <td>{o.completed.toString()}</td>
      </tr>
    )
  })
  return (
    <div>
      <AppBar
        title='Causality Chain Demo'
        iconElementLeft={<NavMenu useHome={'useHome'} />}
      />
      <Paper zDepth={4}>
        <ErrorMessage />
        <Loader1 />
        <div className={styles['table-container']}>
          <table>
            <tbody>
              <tr>
                <th>User Id</th>
                <th>Todo Id</th>
                <th>Text</th>
                <th>Completed</th>
              </tr>
              {tlist}
            </tbody>
          </table>
        </div>
        <RaisedButton className={styles['ajax-button-container']} disabled={getIsBusy} label='Ajax Load' onClick={onGet} />
        <RaisedButton className={styles['ajax-button-container']} disabled={!getIsBusy} label='Abort' onClick={onAbortGet} />
        <RaisedButton className={styles['ajax-button-container']} disabled={getIsBusy} secondary={true} label='Clear' onClick={clear} />
      </Paper>
    </div>
  )
}
