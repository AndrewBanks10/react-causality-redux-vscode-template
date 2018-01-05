
import React from 'react'
import styles from '../../stylesheets/HomeApp'
import NavMenu from '../NavMenu'
import TopHeader from '../TopHeader/TopHeader'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
// Use the below to get the current theme of material-ui
const MuiTheme = getMuiTheme()

const HomeApp = () =>
  <div className={styles.App} style={{ backgroundColor: MuiTheme.appBar.color, color: MuiTheme.appBar.textColor }}>
    <NavMenu id='homeappNavMenu' useHome={false} />
    <div className={styles.Content}>
      <TopHeader />
    </div>
  </div>

export default HomeApp
