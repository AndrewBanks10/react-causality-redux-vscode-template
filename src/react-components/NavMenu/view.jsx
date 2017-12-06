import React from 'react'
import {Link} from 'react-router-dom'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import Popover from 'material-ui/Popover'
import IconButton from 'material-ui/IconButton'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { ASYNCAPP, HOMEROUTE, CAUSALITYCHAINROUTE, NEWSROUTE, COUNTERROUTE, COMMENTSROUTE, ROUTERDEMOROUTE, TODODEMOROUTE, MULTIPARTITIONROUTE } from '../MainApp/MainApp'
import styles from './view.inject'

// Use the below to get the current theme of material-ui
const MuiTheme = getMuiTheme()

const MenuEntry = ({ toText, closeMenu, entryText }) =>
  <MenuItem>
    <Link onClick={closeMenu} className={styles.LinkEntry} to={toText}>{entryText}</Link>
  </MenuItem>

const HomeEntry = ({ useHome, closeMenu }) => {
  if (!useHome) {
    return null
  }
  return (
    <MenuEntry linkid={HOMEROUTE} closeMenu={closeMenu} toText={HOMEROUTE} entryText='Home' />
  )
}

// The controller puts these values below in the props
const NavMenu = ({ openMenu, closeMenu, open, anchorEl, useHome, mochaTesting }) =>
  <div className='NavMenu'>
    <IconButton tooltip='Menu' iconStyle={{ color: MuiTheme.appBar.textColor }} onClick={openMenu}>
      {!mochaTesting ? <NavigationMenu /> : <div />}
    </IconButton>
    <Popover
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      onRequestClose={closeMenu}
    >

      <Menu>
        <HomeEntry useHome={useHome} closeMenu={closeMenu} />
        <MenuEntry id={ASYNCAPP} closeMenu={closeMenu} toText={ASYNCAPP} entryText='Redux Reddit Demo' />
        <MenuEntry id={CAUSALITYCHAINROUTE} closeMenu={closeMenu} toText={CAUSALITYCHAINROUTE} entryText='Causality Chain Demo' />
        <MenuEntry id={NEWSROUTE} closeMenu={closeMenu} toText={NEWSROUTE} entryText='MVC Async Demo' />
        <MenuEntry id={COUNTERROUTE} closeMenu={closeMenu} toText={COUNTERROUTE} entryText='Counter Demo' />
        <MenuEntry id={COMMENTSROUTE} closeMenu={closeMenu} toText={COMMENTSROUTE} entryText='Comment Demo' />
        <MenuEntry id={TODODEMOROUTE} closeMenu={closeMenu} toText={TODODEMOROUTE} entryText='Todo Demo' />
        <MenuEntry id={MULTIPARTITIONROUTE} closeMenu={closeMenu} toText={MULTIPARTITIONROUTE} entryText='Multi Partition Demo' />
        <MenuEntry id={ROUTERDEMOROUTE} closeMenu={closeMenu} toText={ROUTERDEMOROUTE} entryText='Router Demo' />
      </Menu>
    </Popover>
  </div>

export default NavMenu
