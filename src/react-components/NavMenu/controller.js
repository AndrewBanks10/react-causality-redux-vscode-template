import CausalityRedux from 'causality-redux';
import NavMenu from './view';

/*
  Define the partition store definition
*/
const defaultState = {
    open: false,
    mochaTesting: false,
    anchorEl: null
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
    closeMenu: () => {
        partitionState.open = false;
    },
    
    openMenu: (event) => {
        setState({ open: true, anchorEl: event.currentTarget });
    }
};

/*
 This establishes all the connections between the UI and business code.
 It also supports hot reloading for the business logic.
 By default, all the function keys and state keys in the partition definition will be made available in the props
 to the connect redux component uiComponent: NavMenu.
 */
const NavMenu_Partition = 'NavMenu_Partition';

const { partitionState, setState, uiComponent } = CausalityRedux.establishControllerConnections({
    module, // Needed for hot reloading.
    partition: { partitionName: NavMenu_Partition, defaultState, controllerFunctions },
    uiComponent: NavMenu, // Redux connect will be called on this component and returned as uiComponent in the returned object. 
    uiComponentName: 'NavMenu' // Used for tracing.
});

// This is required because of a bug in material-ui with mocha/enzyme testing.
if (process.env.NODE_ENV === 'mochaTesting' || process.env.NODE_ENV === 'mochaDebugTesting')
    partitionState.mochaTesting = true;

// Export the redux connect component. Use this in parent components.
export default uiComponent;
