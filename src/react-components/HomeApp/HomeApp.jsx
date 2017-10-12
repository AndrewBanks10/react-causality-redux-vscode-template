
import React from 'react';
import styles from '../../stylesheets/HomeApp';
import NavMenu from '../NavMenu/controller';
import TopHeader from '../TopHeader/TopHeader';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// Use the below to get the current theme of material-ui
const MuiTheme = getMuiTheme();

const HomeApp = () =>
    <div className={styles.App} style={{ backgroundColor: MuiTheme.appBar.color, color: MuiTheme.appBar.textColor }}>
        <NavMenu useHome={false}/>
        <TopHeader />
    </div>; 

export default HomeApp;