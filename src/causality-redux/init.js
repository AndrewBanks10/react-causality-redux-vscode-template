/* eslint-disable no-console */
import CausalityRedux from 'causality-redux';
// react-causality-redux. This must be imported for react to work.
import 'react-causality-redux';

//
// The two functions below will disclose all transactions to the causality redux store.
//
function onStateChange(arg) {
    console.log(`Cause: ${arg.type}.`);
}

function onListener(arg) {
    //???
    if (arg.listenerName === '') {
       const x = 1;
    } 
    console.log(`Effect: ${arg.listenerName}.`);
}

CausalityRedux.createStore(undefined, undefined, undefined, {onStateChange, onListener});


