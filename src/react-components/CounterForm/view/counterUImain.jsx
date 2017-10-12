import React from 'react';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import NavMenu from '../../../react-components/NavMenu/controller';
import RaisedButton from 'material-ui/RaisedButton';
import styles from '../../../stylesheets/CounterForm';
import counterController from '../controller/countercontroller';

const CounterForm = ({ counter, increment, decrement }) =>
    <div>
        <AppBar
            title='Demonstrates a MVC component with asynchronous model functions.'
            iconElementLeft={<NavMenu useHome={'useHome'} />}
        />
        <Paper zDepth={4}>
            <div className={styles['counter-form-text']}>Multiple child components are updated with one state change/event.</div>
            <div id='counter-text' className={styles['counter-text']}>{`The current counter is ${counter}.`}</div>
            <counterController.CounterFormValue />
            <counterController.CounterFormValue />
            <RaisedButton id='onIncrement' className={styles['counter-form-button']} label="Up" onClick={increment} />
            <RaisedButton id='onDecrement' className={styles['counter-form-button']} label="Down" onClick={decrement} />
        </Paper>    
    </div>;

export default CounterForm;

