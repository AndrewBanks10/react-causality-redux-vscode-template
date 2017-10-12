import React from 'react';
import CausalityRedux from 'causality-redux';
import styles from './monitor.inject.scss';
import { MONITOR_STATE } from './monitorcontroller.js';

const SelectPartition = ({ partitionSelected, partitionSelect, partitions }) => {
    if (!partitionSelect)
        return null;
    const plist = partitions.map((o, index) => {
        return ( 
            <div onClick={() => { partitionSelected(o); }} className={styles.partitionSelectRow}  key={index}>
                {o}
            </div>
  
        );
    });
    return (
        <div className={styles.partitionSelectContainer}>
            <div className={styles.partitionSelectTitle}>
                Select a Partition
            </div>
            <div className={styles.partitionSelectContentContainer}>
                {plist}
            </div>
        </div>
    );
};
const SelectPartitionCR = CausalityRedux.connectChangersAndStateToProps(
    SelectPartition, // Wrapped component
    MONITOR_STATE, // State partition
    ['partitionSelected'], // Changers made avilable through the props to this component.
    ['partitionSelect', 'partitions'],
    'SelectPartition'
);

class MonitorComponent extends React.Component {
    componentDidUpdate() {
        if ( !this.props.isDebugging && this.monitorContentContainer)
            this.monitorContentContainer.scrollTop = this.monitorContentContainer.scrollHeight;
    }
    render() {
        const {selectPartition, selectAll, startDebug, clickedState, backOneState, forwardOneState, stopDebug, replayStates, beginning, exit, minimize, maximize, removeAll, data, isDebugging, currentState, display, isMinimized} = this.props;
        if (!display)
            return null;
    
        if (isMinimized) {
            return (
                <div title='Maximize Monitor.' onClick={() => maximize()} className={styles.maximizeButton}>
                    <div className={styles.maximizeChar}>{'\u25A1'}</div>
                </div>
            );
        }
        const trlist = data.map((o, index) => {
            const theClass = currentState === index ? styles.dataRowOn : styles.dataRow;
            return (
                <tr onClick={() => { clickedState(index); }} className={theClass} key={index}>
                    <td className={styles.dataColumn}>{o}</td>
                </tr>
            );
        });
        const display1 = isDebugging ? 'none' : '';
        const display2 = !isDebugging ? 'none' : '';
        return (
            <div>
                <SelectPartitionCR />
                <div className={styles.monitorContainer}>
                    <div>
                        <div style={{ display: display1 }}>
                            <div className={styles.buttonContainer} >
                                <button title='Select all state partitions to monitor' className={styles.monitorButton} onClick={() => { selectAll(); }} >All</button>
                            </div>
                            <div className={styles.buttonContainer} >
                                <button title='Select one state partition to monitor' className={styles.monitorButton} onClick={() => { selectPartition(); }} >One</button>
                            </div>
                            <div title='Exit Monitor.' onClick={() => exit()} className={styles.transitionExitButton}>
                                {'\u2716'}
                            </div>
                            <div title='Minimize Monitor.' onClick={() => minimize()} className={styles.transitionMinimizeButton}>
                                {'\u2212'}
                            </div>
                            
                            <div title='Clear all current states' onClick={() => removeAll()} className={styles.eraseButton}>
                                {'\u2702'}
                            </div>
                            <div title='Start state debugging' onClick={() => startDebug()} className={styles.debugButton}>
                                {'\u25b6'}
                            </div>
                        </div>
                        <div style={{ display: display2 }}>
                            <div title='Move back one state.' onClick={() => backOneState()} className={styles.transitionButton}>
                                {'\u25c0'}
                            </div>
                            <div title='Move forward one state.' onClick={() => forwardOneState()} className={styles.transitionButton}>
                                {'\u25b6'}
                            </div>
                            <div title='Go to the start state.' onClick={() => beginning()} className={styles.transitionReplayButton}>
                                {'\u27F2'}
                            </div>
                            <div title='Execute states from beginning to end.' onClick={() => replayStates()} className={styles.transitionReplayButton}>
                                {'\u27f3'}
                            </div>
                            <div title='Stop debugging.' onClick={() => stopDebug()} className={styles.transitionStopButton}>
                                {'\u25FC'}
                            </div>
                       
                        </div>
                    </div>
                    <div ref={(div) => { this.monitorContentContainer = div; }} className={styles.monitorContentContainer}>
                        <table>
                            <tbody>
                                {trlist}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
    
export default CausalityRedux.connectChangersAndStateToProps(
    MonitorComponent, // Wrapped component
    MONITOR_STATE, // State partition
    ['selectPartition', 'selectAll', 'startDebug', 'clickedState', 'backOneState', 'forwardOneState', 'stopDebug', 'replayStates', 'beginning', 'exit', 'minimize', 'maximize', 'removeAll'], // Changers made avilable through the props to this component.
    ['data', 'isDebugging', 'currentState', 'display', 'isMinimized'], //data made available through the props.
    'MonitorComponent'
);