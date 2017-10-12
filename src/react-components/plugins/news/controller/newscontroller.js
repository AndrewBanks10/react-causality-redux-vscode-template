import CausalityRedux from 'causality-redux';
import { getNewsSources, getNews } from '../model/newsmodel';
import { NewSourcesButtons, NewsContainer, ErrorMessage, LoaderNews } from '../view/newsUIsub';

//
// This module demonstrates the MVC controller to model and UI connection with a news reader.
//

// This is for react mocha testing. Can't get clientHeight of the document.body in react mocha test mode.
const defaultHeight = 600;
const defaultWidth = 600;

//
// Define the controller functions that access the business code.
// These functions call into the business code and when results are available
// they are responsible for setting redux state partition values with those results.
//
const controllerGetNewsSources = () => {
    // This simple assignment will cause a busy indicator to display in the UI. 
    partitionState.isBusy = true;
    // Call into the business code.
    getNewsSources(
        (sources) => { setState({ isBusy: false, newsSources: sources }); },
        (errorMsg) => { setState({ isBusy: false, errorMsg }); }
    );
};

const controllerGetNews = (source, name) => {
    partitionState.isBusy = true;
    // Call into the business code.
    getNews(
        source,
        name,
        (articles, name) => {
            const newsObj = setNewsObjDimensions();
            newsObj.news = articles;
            newsObj.newsSource = name;
            // This will turn off the busy indicator in the UI and display articles.
            setState({ isBusy: false, newsObj });
        },
        (errorMsg) => {
            // This will turn off the busy indicator in the UI and display an error message.
            setState({ isBusy: false, errorMsg });
        }
    );
};

const controllerClearError = () => {
    partitionState.errorMsg = '';
};

const controllerClearNewsSources = () => {
    partitionState.newsSources = [];
};

const controllerCloseNews = () => {
    partitionState.newsObj = initialNewsObj;
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

// Handle window resizes in the controller
window.addEventListener('resize', handleWindowResize);

// Called just before hot re-load
const hotDisposeHandler = () => {
    window.removeEventListener('resize', handleWindowResize);
};


//
// Define the redux partition
//
const NEWS_PARTITION = 'NEWS_PARTITION';
const initialNewsObj = { news: [], window_x: 0, window_y: 0, newsSource: '' };
const newsPartition = {
    partitionName: NEWS_PARTITION,
    // Define the shape of the redux state partition with initial values.
    defaultState: { newsSources: [], errorMsg: '', isBusy: false, newsObj: initialNewsObj },
    controllerFunctions:
    {
        // UI callable functions.
        'getNewsSources': controllerGetNewsSources,
        'getNews': controllerGetNews,
        'closeNews': controllerCloseNews,
        'clearError': controllerClearError,
        'clear': controllerClearNewsSources
    }
};

//
// Add the partition definition to CausalityRedux.
// module is needed to support hot reloading.
//
const { partitionState, setState } = CausalityRedux.establishControllerConnections({
    module,
    hotDisposeHandler,
    partition: newsPartition 
});

//
// This part of the controller wires state partition values and controller functions
// to the react components through the props.
//

//
// Establish the connections of the store keys and function keys to the component props.
// This takes care of defining react-redux mapStateToProps, mapDispatchToProps and connect.
//
const controllerUIConnections = [
    [
        LoaderNews,    // React Component to wrap with redux connect
        NEWS_PARTITION,// Partition Name
        [],            // Function keys that you want passed into the props of the react component.
        ['isBusy'],    // Partition keys that you want passed into the props of the react component.
        'LoaderNews'   // Name of the react component string form
    ],
    [
        ErrorMessage,
        NEWS_PARTITION,
        ['clearError'], 
        ['errorMsg'],
        'ErrorMessage'
    ],
    [
        NewsContainer,
        NEWS_PARTITION,
        ['closeNews'],
        ['newsObj'],
        'NewsContainer'
    ],
    [
        NewSourcesButtons,
        NEWS_PARTITION,
        ['getNewsSources', 'clear'],
        ['isBusy'],
        'NewSourcesButtons'
    ]
];

// Make the connections happen and save the wrapped components for export.
const exportObj = controllerUIConnections.reduce((exportObj, entry) => {
    exportObj[entry[4]] = CausalityRedux.connectChangersAndStateToProps(...entry);
    return exportObj;
}, { NEWS_PARTITION });

export default exportObj;
