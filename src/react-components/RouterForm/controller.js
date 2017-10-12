import CausalityRedux from 'causality-redux';
import RouterForm from './view';
import { replaceHistory, historyGo, historyForward, historyBack } from './model';

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
    partition: { partitionName: 'RouterForm_Partition', defaultState, controllerFunctions },
    uiComponent: RouterForm, // Redux connect will be called on this component and returned as uiComponent in the returned object. 
    uiComponentName: 'RouterForm' // Used for tracing.
});

// Export the redux connect component. Use this in parent components.
export default uiComponent;
