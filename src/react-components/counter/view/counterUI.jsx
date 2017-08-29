import React from 'react';
import styles from '../../../stylesheets/counter';

const CounterFormValue = ({ counter }) =>
    <div className={styles['counter-form-value']}>
        {`Counter Display: ${counter}`}
    </div>;

export default CounterFormValue;

