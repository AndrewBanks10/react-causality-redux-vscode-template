import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Todo from '../Todo'
import NewsForm from '../NewsForm'
import RouterForm from '../RouterForm'
import HomeApp from '../HomeApp/HomeApp'
import CommentForm from '../CommentForm'
import CounterForm from '../CounterForm'
import MultiPartition from '../MultiPartition'
import AsyncApp from '../RedditRedux/containers/AsyncApp'
import AjaxDemoCausalityChain from '../AjaxDemoCausalityChain'
// Import MonitorComponent last so that any component initialization is not included
import { StateMonitor } from '../StateMonitor'

export const convertToLinkId = (route) => {
  return route.replace(/\\/g, 'xxxlinkid')
}

export const HOMEROUTE = '/'
export const CAUSALITYCHAINROUTE = '/causalitychain'
export const NEWSROUTE = '/news'
export const COUNTERROUTE = '/counterform'
export const COMMENTSROUTE = '/commentbox'
export const ROUTERDEMOROUTE = '/routerdemo'
export const TODODEMOROUTE = '/tododemo'
export const MULTIPARTITIONROUTE = '/multipartition'
export const ASYNCAPP = '/asyncapp'

const MainApp = () =>
  <div>
    <StateMonitor />
    <Switch>
      <Route exact path={HOMEROUTE} component={HomeApp} />
      <Route path={ASYNCAPP} component={AsyncApp} />
      <Route path={CAUSALITYCHAINROUTE} component={AjaxDemoCausalityChain} />
      <Route path={NEWSROUTE} component={NewsForm} />
      <Route path={COUNTERROUTE} component={CounterForm} />
      <Route path={COMMENTSROUTE} component={CommentForm} />
      <Route path={TODODEMOROUTE} component={Todo} />
      <Route path={MULTIPARTITIONROUTE} component={MultiPartition} />
      <Route path={ROUTERDEMOROUTE} component={RouterForm} />
      <Redirect to={HOMEROUTE} />
    </Switch>
  </div>

export default MainApp
