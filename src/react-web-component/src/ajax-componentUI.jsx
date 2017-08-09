import React from 'react';
import CausalityRedux from 'causality-redux';
import CAUSALITY_CHAIN_STATE from './ajax-component-controller';

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

const Loader1 = ({getIsBusy}) => {
    let className = '';
    if ( getIsBusy )
        className = styles.loader;
    return (
        <div className={className} />
    );
};

const ErrorMessage = ({ error, clearError }) => {
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


const LoaderCausalityRedux = CausalityRedux.connectStateToProps(
    Loader1,
    CAUSALITY_CHAIN_STATE,
    ['getIsBusy'],
    'React Loader render'
);

const ErrorMessageCausalityRedux = CausalityRedux.connectChangersAndStateToProps(
    ErrorMessage, // The react component to be wrapped 
    CAUSALITY_CHAIN_STATE, // The state partition that this component is concerned with
    ['clearError'], // Collection of changers this component wants to access and call via props.
    ['error'],  // Collection of state variables that this components wants avaiable through the props.
                // Further, if any of these values are changed by a changer somewhere, the component is 
                // re-rendered with the new values available in the props.
    'React ErrorMessage render' // This is used to tracking with the onListener callback provided by Causality Redux.
                                 // It is not required but can be useful in debugging.
);

//
// React component (ChangeFormValueCausalityRedux) definition for CAUSALITY_CHAIN_STATE
//
const ChangeFormValue = ({onGet, onAbortGet, clear, data, getIsBusy}) => {
    const tlist = data.map((o) => {
        return( 
            <tr key={o.id}>
                <td>{o.userId}</td>
                <td>{o.id}</td>
                <td>{o.title}</td>
                <td>{o.completed.toString()}</td>
            </tr>
        );
    });
    return (
        < div className={styles['change-form']}>
            <ErrorMessageCausalityRedux />
            <LoaderCausalityRedux/>
            <div className={styles['change-form-text']}>
                {'Causality chain example.'}
            </div>
            <div className={styles['table-container']}>
                <table>
                    <tbody>
                      <tr>
                        <th>User Id</th>
                        <th>Todo Id</th>
                        <th>Text</th>
                        <th>Completed</th>                       
                      </tr>
                      {tlist}
                    </tbody>
                </table>
            </div>
            <div className={styles['ajax-button-container1']}>
                <button disabled={getIsBusy} className={styles['form-button']} onClick={() => onGet()}>Ajax Load</button>  
            </div>
            <div className={styles['ajax-button-container1']}>
                <button disabled={!getIsBusy} className={styles['form-button']} onClick={() => onAbortGet()}>Abort</button>  
            </div>                 
            <div className={styles['ajax-button-container2']}>
                <button className={styles['form-button']} onClick={() => clear()}>Clear</button>  
            </div>                  
        </div>
    );
};

//
// CausalityRedux.connectChangersAndStateToProps will bind, the "onGet", "clear" and "onAbortGet" changers that are in the partition 
// CAUSALITY_CHAIN_STATE to the props. Also bind the partition CAUSALITY_CHAIN_STATE value of 'data' to the props.
// This gives access to the function calls, "this.props.onGet", "this.props.clear" and "this.props.onAbortGet" for onClick events. It also gives access to "data" such that
// any changes to "data" will cause a render with the new value of data in this.props.data.
//
// Note that the react component ChangeFormValueCausalityRedux has no dependencies on the react UI tree other than being placed somewhere.
// Note also that this component did not need to import any business logic nor did it need props sent down the UI tree. All it needs 
// from the outside is CausalityRedux and the constant CAUSALITY_CHAIN_STATE. As a result, the component uses javascript only for the 
// purpose of constructing the react DOM and reacting to user interaction.
// onGet will cause an ajax call inside the business logic. onAbortGet will abort onGet in the business logic and clear is a changer
// that restores 'data' in the state partition CAUSALITY_CHAIN_STATE to its default value of an empty array.
//
export default CausalityRedux.connectChangersAndStateToProps(
    ChangeFormValue, // Wrapped component
    CAUSALITY_CHAIN_STATE, // State partition
    ['onGet', 'clear', 'onAbortGet'], // Changers made avilable through the props to this component.
    ['data', 'getIsBusy'],  // State partition variables made available to the props. When the biz code
                            // changes these values, this component is rendered with the new values in the props.
    'React ChangeFormValue render' // Used for debugging and tracking
);




