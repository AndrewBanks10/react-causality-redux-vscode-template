import CausalityRedux from 'causality-redux';
import { getNewsSources, getNews } from './newsmodel';
import { NewSourcesButtons, NewsContainer, ErrorMessage, LoaderNews } from './newsUIsub';

//
// This module demonstrates the MVC controller to model connection with a news reader.
//

// This is for react mocha testing. Can't get clientHeight of the document.body in react mocha test mode.
const defaultHeight = 600;
const defaultWidth = 600;

const controllerGetNewsSources = () => {
    partitionState.isBusy = true;
    getNewsSources(newsSourcesSuccess, networkError);
};

const networkError = (errorMsg) => {
    setState({ isBusy: false, errorMsg });
};

const newsSourcesSuccess = (sources) => {
    setState({ isBusy: false, newsSources: sources });
};

const getNewsSuccess = (articles, name) => {
    const newsObj = setNewsObjDimensions();
    newsObj.news = articles;
    newsObj.newsSource = name;
    // This will turn off the busy indicator in the UI and display articles.
    setState({ isBusy: false, newsObj });
};

const getNewsFail = (errorMsg) => {
    // This will turn off the busy indicator in the UI and display an error message.
    setState({ isBusy: false, errorMsg });
};

const controllerGetNews = (source, name) => {
    partitionState.isBusy = true;
    getNews(source, name, getNewsSuccess, getNewsFail);
};

const setNewsObjDimensions = () => {
    const newsObj = partitionState.newsObj;
    // This is a hack for mocha testing with react and jsdom.
    // Does not support window.document.body.clientWidth/window.document.body.clientHeight
    const w = window.document.body.clientWidth;
    newsObj.window_x = typeof w === 'undefined' ? defaultWidth : w;

    const h = window.document.body.clientHeight;
    newsObj.window_y = typeof h === 'undefined' ? defaultHeight : h;
    return newsObj;
};

const handleWindowResize = () => {
    if (typeof partitionState !== 'undefined')
        partitionState.newsObj = setNewsObjDimensions();
};

window.addEventListener('resize', handleWindowResize);

const NEWS_PARTITION = 'NEWS_PARTITION';
export default NEWS_PARTITION;

const newsPartition = {
    partitionName: NEWS_PARTITION,
    defaultState: { newsSources: [], errorMsg: '', isBusy: false, newsObj: { news: [], window_x: 0, window_y: 0, newsSource: '' } },
    changerDefinitions: {
        // UI callable functions.
        // This business code needs subscribers for the first two functions, getNewsSources and getNews.
        'getNewsSources': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: controllerGetNewsSources},
        'getNews': { operation: CausalityRedux.operations.STATE_FUNCTION_CALL, controllerFunction: controllerGetNews},
        'closeNews': { operation: CausalityRedux.operations.STATE_SETTODEFAULTS, impliedArguments: ['newsObj'] },
        'clearError': { operation: CausalityRedux.operations.STATE_SETTODEFAULTS, impliedArguments: ['errorMsg'] },
        'clear': { operation: CausalityRedux.operations.STATE_SETTODEFAULTS, impliedArguments: ['newsSources'] }
    }
};

// This establishes all the connections between the UI and business code.
// It also supports hot reloading for the business logic.
const { partitionState } = CausalityRedux.establishControllerConnections({
    module,
    partition: newsPartition
});

const { setState } = CausalityRedux.store[NEWS_PARTITION];

const LoaderNewsCausalityRedux = CausalityRedux.connectStateToProps(
    LoaderNews,
    NEWS_PARTITION,
    ['isBusy'], // Give access to the variable isBusy in the NEWS_STATE_PLUGIN partition in the props. Render when this changes.
    'React LoaderNews render'
);

const ErrorMessageCausalityRedux = CausalityRedux.connectChangersAndStateToProps(
    ErrorMessage, // The react component to be wrapped 
    NEWS_PARTITION, // The state partition that this component is concerned with
    ['clearError'], // Collection of changers this component wants to access and call via props.
    ['errorMsg'],  // Collection of state variables that this components wants avaiable through the props.
                // Further, if any of these values are changed by a changer somewhere, the component is 
                // re-rendered with the new values available in the props.
    'React ErrorMessage render' // This is used to tracking with the onListener callback provided by Causality Redux.
                                 // It is not required but can be useful in debugging.
);

const NewsContainerCausalityRedux = CausalityRedux.connectChangersAndStateToProps(
    NewsContainer, // The react component to be wrapped 
    NEWS_PARTITION, // The state partition that this component is concerned with
    ['closeNews'], // Collection of changers this component wants to access and call via props.
    ['newsObj'],  // Collection of state variables that this components wants avaiable through the props.
                // Further, if any of these values are changed by a changer somewhere, the component is 
                // re-rendered with the new values available in the props.
    'React NewsContainer render' // This is used to tracking with the onListener callback provided by Causality Redux.
                                  // It is not required but can be useful in debugging.
);

const NewSourcesButtonsCausalityRedux = CausalityRedux.connectChangersAndStateToProps(
    NewSourcesButtons, // Wrapped component
    NEWS_PARTITION, // State partition
    ['getNewsSources', 'clear'], // Changers made available through the props to this component.
    ['isBusy'],  // State partition variables made available to the props. When the biz code
                            // changes these values, this component is rendered with the new values in the props.
    'React NewSourcesButtons render' // Used for debugging and tracking
);

export { LoaderNewsCausalityRedux, ErrorMessageCausalityRedux, NewsContainerCausalityRedux, NewSourcesButtonsCausalityRedux };
