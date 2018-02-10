import React from 'react'
import styles from './Loader.inject'
import CircularProgress from 'material-ui/CircularProgress'

const Loader = () =>
  <div className={styles['center-div-on-screen']}><CircularProgress size={60} thickness={7} /></div>

export default Loader
