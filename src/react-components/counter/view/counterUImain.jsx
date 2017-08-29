import React from 'react';
import styles from '../../../stylesheets/counter';
import counterController from '../controller/countercontroller';

const CounterForm = ({ counter, increment, decrement }) =>
    <div className={styles['counter-form']}>
        <div className={styles['counter-form-text']}>Multiple child components are updated with one state change/event.</div>
        <counterController.CounterFormValue />
        <counterController.CounterFormValue />
        <div className={styles['counter-form-button-container']}>
            <div id='counter-text' className={styles['counter-text']}>{`The current counter is ${counter}.`}</div>
            <div className={styles['counter-form-button']}>
                <button id='onIncrement' onClick={increment}>Up</button>
            </div>
            <button id='onDecrement' onClick={decrement}>Down</button>
        </div>
    </div>;

export default CounterForm;

