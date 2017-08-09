import CausalityRedux from 'causality-redux';
import { handleGet, handleAbort } from './ajax-component-model';

const handleGetSuccess = (data) => {
    setState({ getIsBusy: false, data });
};

const handleGetFail = (error) => {
    setState({ getIsBusy: false, error });
};

const controllerHandleGet = () => {
    partitionState.getIsBusy = true;
    handleGet(handleGetSuccess, handleGetFail);
};

const controllerHandleAbort = () => {
    handleAbort();
    partitionState.getIsBusy = false;
};

//
// CausalityRedux partition for CAUSALITY_CHAIN_STATE
//
const CAUSALITY_CHAIN_STATE = 'CAUSALITY_CHAIN_STATE';
export default CAUSALITY_CHAIN_STATE;

const causalityChain = {
    partitionName: CAUSALITY_CHAIN_STATE,
    defaultState: {data: [], spinnerCount:0, error:'', getIsBusy:false},
    changerDefinitions: {
        'onGet':        { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction:controllerHandleGet},
        'onAbortGet':   { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction:controllerHandleAbort},
        'clearError':   { operation: CausalityRedux.operations.STATE_SETTODEFAULTS, impliedArguments: ['error'] },
        'clear':        { operation: CausalityRedux.operations.STATE_SETTODEFAULTS, impliedArguments: ['data'] } 
    }
};

// This establishes all the connections between the UI and business code.
// It also supports hot reloading for the business logic.
const { partitionState } = CausalityRedux.establishControllerConnections({
    module,
    partition: causalityChain
});

const { setState } = CausalityRedux.store[CAUSALITY_CHAIN_STATE];

