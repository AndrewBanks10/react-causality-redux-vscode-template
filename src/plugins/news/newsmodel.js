
import { newsNonUIData } from './newsdata';
import Http from '../../util/http';

const sourceURL = 'https://newsapi.org/v1/sources?language=en';
const newsURL = 'https://newsapi.org/v1/articles';

// Please do not use my key. Go here to get your own.
// https://newsapi.org
const apiKey = 'ce36820a866d431f82a1dd77c56592cb';

let http, _getNewsSourcesSuccess, _getNewsSourcesFail, _getNewsSuccess, _getNewsFail;

const handleGet = (url, successCallback, errorCallback) => {
    http = new Http();
    http.get(url, successCallback, errorCallback);
};

const getNewsSources = (getNewsSourcesSuccess, getNewsSourcesFail) => {
    _getNewsSourcesSuccess = getNewsSourcesSuccess;
    _getNewsSourcesFail = getNewsSourcesFail;
    // Check the cache. Demonstrates the use of no UI module data contained in a separate file
    // so that hot re-loading works properly.
    if (newsNonUIData.newsSourcesCache.length > 0)
        newsSourcesSuccess({ sources: newsNonUIData.newsSourcesCache });
    else
        handleGet(sourceURL, newsSourcesSuccess, newsSourcesFail);
};

const getNews = (source, name, getNewsSuccess, getNewsFail) => {
    _getNewsSuccess = getNewsSuccess;
    _getNewsFail = getNewsFail;
    handleGet(`${newsURL}?source=${source}&sortBy=top&apiKey=${apiKey}`, function (data) { newsSuccess(data, name);}, newsFail);
};

const newsSourcesFail = (errorMsg) => {
    http = null;
    _getNewsSourcesFail(errorMsg);
};

const newsSourcesSuccess = (data) => {
    http = null;
    // Set the newsSourcesCache.
    newsNonUIData.newsSourcesCache = data.sources;
    _getNewsSourcesSuccess(data.sources);
};

const newsSuccess = (data, name) => {
    http = null;
    _getNewsSuccess(data.articles, name);
};

const newsFail = (errorMsg) => {
    http = null;
    _getNewsFail(errorMsg);
};

export { getNewsSources, getNews };



