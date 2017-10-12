import CausalityRedux from 'causality-redux';
import NewsForm from '../view/newsUImain';
import newsController from './newscontroller';

// This module demonstrates a controller to UI connection.

export default CausalityRedux.connectChangersAndStateToProps(
    NewsForm, // Wrapped component
    newsController.NEWS_PARTITION, // State partition
    ['getNews'], // Changers made available through the props to this component.
    ['newsSources'],  // State partition variables made available to the props. When the biz code
                            // changes these values, this component is rendered with the new values in the props.
    'NewsSources' // Used for debugging and tracking
);


