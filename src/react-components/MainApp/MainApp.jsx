import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import HomeApp from '../HomeApp/HomeApp'
import { StateMonitor } from '../StateMonitor'
import {
  homeRoute,
  causalityChainRoute,
  newsRoute,
  counterRoute,
  commentRoute,
  routerRoute,
  todoRoute,
  multiPartitionRoute,
  asyncAppRoute,
  AjaxDemoCausalityChain,
  NewsForm,
  CounterForm,
  CommentForm,
  Todo,
  MultiPartition,
  RouterForm,
  AsyncApp
} from '../../util/routes'

//
// The code below demonstrates dynamic loading of components and the react router.
//

//
// React router
//
const MainApp = () =>
  <div>
    <StateMonitor />
    <Switch>
      <Route exact path={homeRoute} component={HomeApp} />
      <Route path={asyncAppRoute} component={AsyncApp} />
      <Route path={causalityChainRoute} component={AjaxDemoCausalityChain} />
      <Route path={newsRoute} component={NewsForm} />
      <Route path={counterRoute} component={CounterForm} />
      <Route path={commentRoute} component={CommentForm} />
      <Route path={todoRoute} component={Todo} />
      <Route path={multiPartitionRoute} component={MultiPartition} />
      <Route path={routerRoute} component={RouterForm} />
      <Redirect to={homeRoute} />
    </Switch>
  </div>

export default MainApp
