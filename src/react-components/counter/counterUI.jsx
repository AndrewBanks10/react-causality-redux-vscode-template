import React from 'react';
import styles from '../../stylesheets/counter';
import CausalityRedux from 'causality-redux';
import COUNTER_STATE from './countercontroller';

const CounterFormValue = ({ counter }) =>
    <div className={styles['counter-form-value']}>
        {`Counter Display: ${counter}`}
    </div>;

const CounterFormValueCausalityRedux = CausalityRedux.connectStateToProps(CounterFormValue, COUNTER_STATE, ['counter'], 'React CounterFormValueCausalityRedux render');
const CounterFormValueCausalityRedux2 = CausalityRedux.connectStateToProps(CounterFormValue, COUNTER_STATE, ['counter'], 'React CounterFormValueCausalityRedux2 render');
const CounterFormValueCausalityRedux3 = CausalityRedux.connectStateToProps(CounterFormValue, COUNTER_STATE, ['counter'], 'React CounterFormValueCausalityRedux3 render');
const CounterFormValueCausalityRedux4 = CausalityRedux.connectStateToProps(CounterFormValue, COUNTER_STATE, ['counter'], 'React CounterFormValueCausalityRedux4 render');

const CounterForm = ({ counter, increment, decrement }) =>
    <div className={styles['counter-form']}>
        <div className={styles['counter-form-text']}>Multiple child components are updated with one state change/event.</div>
        <CounterFormValueCausalityRedux />
        <CounterFormValueCausalityRedux2 />
        <CounterFormValueCausalityRedux3 />
        <CounterFormValueCausalityRedux4 />
        <div className={styles['counter-form-button-container']}>
            <div id='counter-text' className={styles['counter-text']}>{`The current counter is ${counter}.`}</div>
            <div className={styles['counter-form-button']}>
                <button id='onIncrement' onClick={increment}>Up</button>
            </div>
            <button id='onDecrement' onClick={decrement}>Down</button>
        </div>
    </div>;

export default CausalityRedux.connectChangersAndStateToProps(
    CounterForm, // Wrapped component
    COUNTER_STATE, // State partition
    ['increment', 'decrement'], // Changers made available through the props to this component.
    ['counter'],  // State partition variables made available to the props. When the biz code
                            // changes these values, this component is rendered with the new values in the props.
    'React CounterForm render' // Used for debugging and tracking
);
