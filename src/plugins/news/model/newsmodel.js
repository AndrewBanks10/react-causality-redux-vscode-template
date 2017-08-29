import { newsNonUIData } from './newsdata';
import Http from '../../../util/http';

const sourceURL = 'https://newsapi.org/v1/sources?language=en';
const newsURL = 'https://newsapi.org/v1/articles';

// Please do not use my key. Go here to get your own.
// https://newsapi.org
const apiKey = 'ce36820a866d431f82a1dd77c56592cb';

const getNewsSources = (getNewsSourcesSuccess, getNewsSourcesFail) => {
    // Check the cache. Demonstrates the use of no UI module data contained in a separate file
    // so that hot re-loading works properly.
    if (newsNonUIData.newsSourcesCache.length > 0) {
        getNewsSourcesSuccess(newsNonUIData.newsSourcesCache);
        return;
    }
    const http = new Http();
    http.get(
        sourceURL,
        (data) => { getNewsSourcesSuccess(newsNonUIData.newsSourcesCache = data.sources); },
        getNewsSourcesFail
    );
};

const getNews = (source, name, getNewsSuccess, getNewsFail) => {
    const http = new Http();
    http.get(
        `${newsURL}?source=${source}&sortBy=top&apiKey=${apiKey}`,
        (data) => { getNewsSuccess(data.articles, name); },
        getNewsFail
    );
};

export { getNewsSources, getNews };



