import React from 'react';

//
// This react UI module includes some causality-redux controller logic.
// This technique reduces the number of files for a component but
// also is it more than likely that this controller portion would be
// replaced if react is replaced. So, there is no technical violation of MVC.
//

//
// This is a css injection because this component is an independent react web component.
// Injections must be in files named, name.inject.css, name.inject.scss, name.inject.sass
// or name.inject.less. The injection will not be part of the final css of the project.
//
import styles from './ajax-componentUI.inject';

export const Loader1 = ({getIsBusy}) => {
    let className = '';
    if ( getIsBusy )
        className = styles.loader;
    return (
        <div className={className} />
    );
};

export const ErrorMessage = ({ error, clearError }) => {
    if (error === '')
        return null;
    return (
        <div className={`${styles['center-div-on-screen']} ${styles['error-message']}`}>
            <div className={styles['error-message-text']}>{error}</div>
            <br />
            <button onClick={() => clearError()}>OK</button>
        </div>
    );
};



