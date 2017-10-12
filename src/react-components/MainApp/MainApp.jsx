import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import CommentForm from '../CommentForm/view/commentsUI';
import CounterForm from '../CounterForm/controller/countercontrollerUImain';
import NewsForm from '../plugins/news/controller/newscontrollerUImain';
import AjaxDemoCausalityChain from '../../react-web-component/index';
import RouterForm from '../RouterForm/controller';
import HomeApp from '../HomeApp/HomeApp';

export const HOMEROUTE = '/';
export const CAUSALITYCHAINROUTE = '/causalitychain';
export const NEWSROUTE = '/newscausalityredux';
export const COUNTERROUTE = '/counterformcausalityredux';
export const COMMENTSROUTE = '/commentboxcausalityredux';
export const ROUTERDEMOROUTE = '/routerdemo';

const MainApp = () =>
    <Switch>
        <Route exact path={HOMEROUTE} component={HomeApp} />
        <Route path={CAUSALITYCHAINROUTE} component={AjaxDemoCausalityChain} />
        <Route path={NEWSROUTE} component={NewsForm} />
        <Route path={COUNTERROUTE} component={CounterForm} />
        <Route path={COMMENTSROUTE} component={CommentForm} />
        <Route path={ROUTERDEMOROUTE} component={RouterForm} />
        <Redirect to={HOMEROUTE} />
    </Switch>;

export default MainApp;
