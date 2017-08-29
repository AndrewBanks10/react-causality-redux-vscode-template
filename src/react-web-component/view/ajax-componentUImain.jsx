import React from 'react';
import ajaxController from '../controller/ajax-componentcontroller';

//
// This is a css injection because this component is an independent react web component.
// Injections must be in files named, name.inject.css, name.inject.scss, name.inject.sass
// or name.inject.less. The injection will not be part of the final css of the project.
//
import styles from './ajax-componentUI.inject';

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
            <ajaxController.ErrorMessage />
            <ajaxController.Loader1/>
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

export default ChangeFormValue;





