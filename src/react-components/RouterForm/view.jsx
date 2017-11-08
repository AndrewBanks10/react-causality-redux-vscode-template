import React from 'react'
import Paper from 'material-ui/Paper'
import AppBar from 'material-ui/AppBar'
import NavMenu from '../../react-components/NavMenu/controller'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import styles from './view.inject'

const RouterForm = ({ currentUrl, goText, onChangeURL, changeURL, onChangeGo, onGo, onForward, onBack }) =>
  <div>
    <AppBar
      title='Router Demo'
      iconElementLeft={<NavMenu useHome={'useHome'} />}
    />
    <Paper zDepth={4}>
      <div className={styles.section}>
        <div className={styles.title} >History Forward one.</div>
        <RaisedButton onClick={onForward} label='Forward' />
      </div>
      <div className={styles.section}>
        <div className={styles.title} >History Back one.</div>
        <RaisedButton onClick={onBack} label='Back' />
      </div>
      <div className={styles.section}>
        <div className={styles.title} >Input a positive or negative number for the history go command.</div>
        <TextField
          hintText='History Go'
          onChange={(e) => onChangeGo(e.target.value)}
          value={goText}
          style={{width: '100px', marginRight: '10px'}}
        />
        <RaisedButton onClick={onGo} label='Go' />
      </div>
      <div className={styles.section}>
        <div className={styles.title} >Input a valid link to replace this one.</div>
        <TextField
          hintText='Replace Current URL'
          onChange={(e) => onChangeURL(e.target.value)}
          value={currentUrl}
          style={{width: '180px', marginRight: '10px'}}
        />
        <RaisedButton onClick={changeURL} label='Replace' />
      </div>
    </Paper>
  </div>

export default RouterForm
