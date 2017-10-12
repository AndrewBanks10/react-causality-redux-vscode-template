import React from 'react';
import styles from '../../../stylesheets/CounterForm';

const CounterFormValue = ({ counter }) =>
    <div className={styles['counter-form-value']}>
        {`Counter Display: ${counter}`}
    </div>;

export default CounterFormValue;

