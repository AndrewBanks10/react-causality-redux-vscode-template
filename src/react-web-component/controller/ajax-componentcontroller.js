import CausalityRedux from 'causality-redux';
import { handleGet, handleAbort } from '../model/ajax-componentmodel';
import { Loader1, ErrorMessage } from '../view/ajax-componentUI';

const controllerHandleGet = () => {
    partitionState.getIsBusy = true;
    handleGet(
        (data) => { setState({ getIsBusy: false, data });},
        (error) => { setState({ getIsBusy: false, error });}
    );
};

const controllerHandleAbort = () => {
    handleAbort();
    partitionState.getIsBusy = false;
};

const controllerClearError = () => {
    partitionState.errorMsg = '';
};

const controllerClearData = () => {
    partitionState.data = [];
};

//
// CausalityRedux partition for CAUSALITY_CHAIN_STATE
//
const CAUSALITY_CHAIN_STATE = 'CAUSALITY_CHAIN_STATE';
const causalityChain = {
    partitionName: CAUSALITY_CHAIN_STATE,
    defaultState: {data: [], spinnerCount:0, error:'', getIsBusy:false},
    controllerFunctions: {
        'onGet':      controllerHandleGet,
        'onAbortGet': controllerHandleAbort,
        'clearError': controllerClearError,
        'clear':      controllerClearData 
    }
};

// This establishes all the connections between the UI and business code.
// It also supports hot reloading for the business logic.
const { partitionState, setState } = CausalityRedux.establishControllerConnections({
    module,
    partition: causalityChain
});

const controllerUIConnections = [
    [
        Loader1,    // React Component to wrap with redux connect
        CAUSALITY_CHAIN_STATE,// Partition Name
        [],            // Function keys that you want passed into the props of the react component.
        ['getIsBusy'],    // Partition keys that you want passed into the props of the react component.
        'Loader1'   // Name of the react component string form
    ],
    [
        ErrorMessage,
        CAUSALITY_CHAIN_STATE,
        ['clearError'], 
        ['error'],
        'ErrorMessage'
    ]
];

// Make the connections happen and save the wrapped components for export.
const exportObj = controllerUIConnections.reduce((exportObj, entry) => {
    exportObj[entry[4]] = CausalityRedux.connectChangersAndStateToProps(...entry);
    return exportObj;
}, { CAUSALITY_CHAIN_STATE });

export default exportObj;