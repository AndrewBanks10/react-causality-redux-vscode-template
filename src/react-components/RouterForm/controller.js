import CausalityRedux from 'causality-redux';
import RouterForm from './view';
import { replaceHistory, historyGo, historyForward, historyBack } from './model';

const undefinedString = 'undefined';

function establishControllerConnections({ module, uiComponent, uiComponentName, partition, storeKeys, changerKeys, hotDisposeHandler, controllerUIConnections }) {
    
    if (typeof controllerUIConnections !== undefinedString) {
        if (typeof partition !== undefinedString) {
            controllerUIConnections.forEach(entry => {
                partition.defaultState[entry[4]] = null;
            });
        }    
    }   

    let partitionState;
    let setState;
    let getState;
    let partitionStore;
    const unsubscribers = [];

    if (typeof partition !== undefinedString) {
        // Create the causality-redux store and use the store partition above for definitions.
        // If the store has already been created elsewhere, then only the input partition is created.
        CausalityRedux.createStore(partition);

        const foundPartition = CausalityRedux.partitionDefinitions.find(e =>
            partition.partitionName === e.partitionName
        );

        // Get access to the partition’s controller functions.
        partitionStore = CausalityRedux.store[foundPartition.partitionName];

        // Get a proxy to the store partition so that causality-redux can detect changes to the values of the partition.
        partitionState = partitionStore.partitionState;

        // Allows setting multiple keys in a state partition.
        setState = partitionStore.setState;

        getState = partitionStore.getState;

        const funcKeys = [];
        CausalityRedux.getKeys(foundPartition.changerDefinitions).forEach(changerKey => {
            const entry = foundPartition.changerDefinitions[changerKey];
            if (entry.operation === CausalityRedux.operations.STATE_FUNCTION_CALL) {
                if (typeof partition.controllerFunctions !== 'undefined' && typeof partition.controllerFunctions[changerKey] === 'function')
                    unsubscribers.push(partitionStore.subscribe(partition.controllerFunctions[changerKey], changerKey));
                else
                    unsubscribers.push(partitionStore.subscribe(partition.changerDefinitions[changerKey].controllerFunction, changerKey));
                funcKeys.push(changerKey);
            }
        });

        if (typeof storeKeys === 'undefined')
            storeKeys = CausalityRedux.getKeys(foundPartition.defaultState);
        else if (storeKeys.length === 0)
            storeKeys = undefined;

        if (typeof changerKeys === 'undefined')
            changerKeys = funcKeys;
        else if (changerKeys.length === 0)
            changerKeys = undefined;
    
        if (typeof uiComponent !== 'undefined') {
            uiComponentName = typeof uiComponentName === 'undefined' ? 'React component render' : `${uiComponentName} render`;
            uiComponent = CausalityRedux.connectChangersAndStateToProps(
                uiComponent, // React component to wrap.
                foundPartition.partitionName, // State partition
                // This is an array of names of changers/action creators defined in the partition that you want
                // passed into the props by causality-redux so that the component can call these functions.
                changerKeys,
                // This is an array of keys in COUNTTEN_STATE whose values you want passed into the props.
                // Whenever any value associated with a key listed in this array changes in the causality-redux store,
                // causality-redux will cause the component to render with the new values set in the props.
                storeKeys,
                uiComponentName
            );
        }
    }    

    if (typeof module !== undefinedString && module.hot) {
        // Add the dispose handler that is to be called before this module is changed out for the new one. 
        // This must be done for any module with side effects like adding event listeners etc.
        module.hot.dispose(function () {
            if ( typeof unsubscribers !== undefinedString )
                unsubscribers.forEach(unsubscriber => unsubscriber());
            if (typeof hotDisposeHandler === 'function')
                hotDisposeHandler();
        });
    }

    if (typeof controllerUIConnections !== undefinedString) {
        const stateObj = {};
        controllerUIConnections.forEach(entry =>
            stateObj[entry[4]] = CausalityRedux.connectChangersAndStateToProps(...entry)
        );
        // This is true if a partition definition is being used
        // Set the enhanced components in the store.
        if (typeof setState !== undefinedString)
            setState(stateObj);
        else {
            // Otherwise, return the redux connected component(s) in a object if multiple
            // components were sent in otherwise, return just the one component.
            if (controllerUIConnections.length === 1)
                uiComponent = stateObj[controllerUIConnections[0][4]];
            else
                uiComponent = stateObj;
        }
    }

    return {
        partitionState,
        setState,
        getState,
        partitionStore,
        uiComponent
    };
}


/*
 Define the partition store definition
*/
const defaultState = {
    currentUrl: '',
    goText: ''
};

/*
 Define Controller functions available to the UI.
 Use partitionState to access the keys of default state in these functions.
 partitionState is a proxy that returns a copy of the value at the selected key.
 let value = partitionState.key;
 modify value.
 To set a key do partitionState.key = value;
 use setState to set multiple keys like setState({key1: val1, key2: val2});
*/
const RouterForm_Partition = 'RouterForm_Partition';

const controllerFunctions = {
    onChangeURL: (url) => {
        partitionState.currentUrl = url;
    },

    changeURL: () => {
        replaceHistory(partitionState.currentUrl);
        partitionState.currentUrl = '';
    },

    onChangeGo: (goText) => {
        partitionState.goText = goText;
    },

    onGo: () => {
        historyGo(partitionState.goText);
        partitionState.goText = '';
    },

    onForward: () => {
        historyForward();
    },

    onBack: () => {
        historyBack();
    },
};

/*
 This establishes all the connections between the UI and business code.
 It also supports hot reloading for the business logic.
 By default, all the function keys and state keys in the partition definition will be made available in the props
 to the connect redux component uiComponent: NavMenu.
 */
const { partitionState, uiComponent } = CausalityRedux.establishControllerConnections({
    module, // Needed for hot reloading.
    partition: { partitionName: RouterForm_Partition, defaultState, controllerFunctions },
    uiComponent: RouterForm, // Redux connect will be called on this component and returned as uiComponent in the returned object. 
    uiComponentName: 'RouterForm' // Used for tracing.
});

// Export the redux connect component. Use this in parent components.
export default uiComponent;
