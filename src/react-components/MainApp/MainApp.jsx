import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Loadable from 'react-loadable'
import HomeApp from '../HomeApp/HomeApp'
import Loader from '../common/Loader'
import { StateMonitor } from '../StateMonitor'

//
// The code below demonstrates dynamic loading of components and the react router.
//

//
// Dynamically loaded components
//
const AsyncApp = Loadable({
  loader: () => import('../RedditRedux/containers/AsyncApp'),
  loading: Loader
})

const Todo = Loadable({
  loader: () => import('../Todo'),
  loading: Loader
})

const NewsForm = Loadable({
  loader: () => import('../NewsForm'),
  loading: Loader
})

const RouterForm = Loadable({
  loader: () => import('../RouterForm'),
  loading: Loader
})

const CommentForm = Loadable({
  loader: () => import('../CommentForm'),
  loading: Loader
})

const CounterForm = Loadable({
  loader: () => import('../CounterForm'),
  loading: Loader
})

const MultiPartition = Loadable({
  loader: () => import('../MultiPartition'),
  loading: Loader
})

const AjaxDemoCausalityChain = Loadable({
  loader: () => import('../AjaxDemoCausalityChain'),
  loading: Loader
})

export const convertToLinkId = (route) => {
  return route.replace(/\\/g, 'xxxlinkid')
}

//
// Used for react Link in NavMenu.
//
export const HOMEROUTE = '/'
export const CAUSALITYCHAINROUTE = '/causalitychain'
export const NEWSROUTE = '/news'
export const COUNTERROUTE = '/counterform'
export const COMMENTSROUTE = '/commentbox'
export const ROUTERDEMOROUTE = '/routerdemo'
export const TODODEMOROUTE = '/tododemo'
export const MULTIPARTITIONROUTE = '/multipartition'
export const ASYNCAPP = '/asyncapp'

//
// React router
//
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
