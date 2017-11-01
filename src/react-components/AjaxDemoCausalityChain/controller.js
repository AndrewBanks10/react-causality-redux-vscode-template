import CausalityRedux from 'causality-redux';
import { handleGet, handleAbort } from './model';
import { Loader1, ErrorMessage, AjaxDemoCausalityChain } from './view';

const defaultState = {
    data: [],
    spinnerCount: 0,
    error: '',
    getIsBusy: false
};

const controllerFunctions = {
    onGet: () => {
        partitionState.getIsBusy = true;
        handleGet(
            (data) => { setState({ getIsBusy: false, data }); },
            (error) => { setState({ getIsBusy: false, error }); }
        );
    },
    onAbortGet: () => {
        handleAbort();
        partitionState.getIsBusy = false;
    },
    clearError: () =>
        partitionState.errorMsg = '',
    clear: () =>
        partitionState.data = []
};

export const AjaxDemoCausalityChain_Partition = 'AjaxDemoCausalityChain_Partition';

const controllerUIConnections = [
    [
        Loader1,    // React Component to wrap with redux connect
        AjaxDemoCausalityChain_Partition,
        [],            // Function keys that you want passed into the props of the react component.
        ['getIsBusy'],    // Partition keys that you want passed into the props of the react component.
        'Loader1'   // Name of the react component string form
    ],
    [
        ErrorMessage,
        AjaxDemoCausalityChain_Partition,
        ['clearError'], 
        ['error'],
        'ErrorMessage'
    ],
    [
        AjaxDemoCausalityChain,
        AjaxDemoCausalityChain_Partition,
        ['onGet', 'onAbortGet', 'clear'],
        ['data', 'getIsBusy', 'ErrorMessage', 'Loader1'],
        'AjaxDemoCausalityChain'
    ]
];

// This establishes all the connections between the UI and business code.
// It also supports hot reloading for the business logic.
const { partitionState, setState, wrappedComponents } = CausalityRedux.establishControllerConnections({
    module,
    partition: { partitionName: AjaxDemoCausalityChain_Partition, defaultState, controllerFunctions },
    controllerUIConnections
});

export default wrappedComponents.AjaxDemoCausalityChain;
