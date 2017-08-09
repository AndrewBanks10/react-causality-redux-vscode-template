import React from 'react';
import CausalityRedux from 'causality-redux';
import { Provider } from 'react-redux';
import ChangeFormValueCausalityRedux from '../react-web-component/src/ajax-componentUI';
import TopHeader from './top-header';
import CommentBox from './comments/commentsUI';
import CounterFormCausalityRedux from './counter/counterUI';
import NewsCausalityRedux from '../plugins/news/newscontrollerUImain';
import MonitorComponent from '../cr-monitor/index';
import styles from '../stylesheets/App';

const App = () =>
    <Provider store={CausalityRedux.store}>
        <div className={styles.App}>
            <MonitorComponent />
            <TopHeader />
            <ChangeFormValueCausalityRedux />
            <NewsCausalityRedux />
            <CounterFormCausalityRedux />
            <CommentBox />
        </div>
    </Provider>;

export default App;

