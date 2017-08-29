import CausalityRedux from 'causality-redux';
import CounterForm from '../view/counterUImain';
import counterController from './countercontroller';

// This might be considered controller logic, but in the event that the UI is removed this code would
// most likely be removed also.
export default CausalityRedux.connectChangersAndStateToProps(
    CounterForm, // Wrapped component
    counterController.COUNTER_STATE, // State partition
    ['increment', 'decrement'], // Changers made available through the props to this component.
    ['counter'],  // State partition variables made available to the props. When the biz code
                            // changes these values, this component is rendered with the new values in the props.
    'CounterForm render' // Used for debugging and tracking
);
