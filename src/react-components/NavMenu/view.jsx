import React from 'react'
import {Link} from 'react-router-dom'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import Popover from 'material-ui/Popover'
import IconButton from 'material-ui/IconButton'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import styles from './view.inject'
import {
  homeRoute,
  causalityChainRoute,
  newsRoute,
  counterRoute,
  commentRoute,
  routerRoute,
  todoRoute,
  multiPartitionRoute,
  asyncAppRoute
} from '../../util/routes'

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
    <MenuEntry linkid={homeRoute} closeMenu={closeMenu} toText={homeRoute} entryText='Home' />
  )
}

// The controller puts these values below in the props
const NavMenu = ({ openMenu, closeMenu, open, anchorEl, useHome, mochaTesting }) =>
  <div className={styles.NavMenu}>
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
        <MenuEntry id={asyncAppRoute} closeMenu={closeMenu} toText={asyncAppRoute} entryText='Redux Reddit Demo' />
        <MenuEntry id={causalityChainRoute} closeMenu={closeMenu} toText={causalityChainRoute} entryText='Causality Chain Demo' />
        <MenuEntry id={newsRoute} closeMenu={closeMenu} toText={newsRoute} entryText='MVC Async Demo' />
        <MenuEntry id={counterRoute} closeMenu={closeMenu} toText={counterRoute} entryText='Counter Demo' />
        <MenuEntry id={commentRoute} closeMenu={closeMenu} toText={commentRoute} entryText='Comment Demo' />
        <MenuEntry id={todoRoute} closeMenu={closeMenu} toText={todoRoute} entryText='Todo Demo' />
        <MenuEntry id={multiPartitionRoute} closeMenu={closeMenu} toText={multiPartitionRoute} entryText='Multi Partition Demo' />
        <MenuEntry id={routerRoute} closeMenu={closeMenu} toText={routerRoute} entryText='Router Demo' />
      </Menu>
    </Popover>
  </div>

export default NavMenu
