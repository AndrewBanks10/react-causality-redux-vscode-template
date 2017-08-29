import CausalityRedux from 'causality-redux';
import ChangeFormValue from './view/ajax-componentUImain';
import ajaxController from './controller/ajax-componentcontroller';
//
// This is a sample of a causality-redux independent component.
// It has no dependencies on the tree and uses injected css.
//

//
// CausalityRedux.connectChangersAndStateToProps will bind, the "onGet", "clear" and "onAbortGet" changers that are in the partition 
// CAUSALITY_CHAIN_STATE to the props. Also bind the partition CAUSALITY_CHAIN_STATE value of 'data' to the props.
// This gives access to the function calls, "this.props.onGet", "this.props.clear" and "this.props.onAbortGet" for onClick events. It also gives access to "data" such that
// any changes to "data" will cause a render with the new value of data in this.props.data.
//
// Note that this react component ChangeFormValue has no dependencies on the react UI tree other than being placed somewhere.
// Note also that this component did not need to import any business logic nor did it need props sent down the UI tree. All it needs 
// from the outside is CausalityRedux and the constant CAUSALITY_CHAIN_STATE. As a result, the component uses javascript only for the 
// purpose of constructing the react DOM and reacting to user interaction.
// onGet will cause an ajax call inside the business logic. onAbortGet will abort onGet in the business logic and clear is a changer
// that restores 'data' in the state partition CAUSALITY_CHAIN_STATE to its default value of an empty array.
//
export default CausalityRedux.connectChangersAndStateToProps(
    ChangeFormValue, // Wrapped component
    ajaxController.CAUSALITY_CHAIN_STATE, // State partition
    ['onGet', 'clear', 'onAbortGet'], // Changers made avilable through the props to this component.
    ['data', 'getIsBusy'],  // State partition variables made available to the props. When the biz code
                            // changes these values, this component is rendered with the new values in the props.
    'ChangeFormValue render' // Used for debugging and tracking
);




