import Http from '../../util/http'
import moduleData from './modeldata'

const sourceURL = 'https://newsapi.org/v1/sources?language=en'
const newsURL = 'https://newsapi.org/v1/articles'

// Please do not use my key. Go here to get your own.
// https://newsapi.org
const apiKey = 'ce36820a866d431f82a1dd77c56592cb'

const getSources = (getNewsSourcesSuccess, getNewsSourcesFail) => {
  // Check the cache. Demonstrates the use of no UI module data contained in a separate file
  // so that hot re-loading works properly.
  // Note below since moduleData.newsSourcesCache returns a copy, we should cache it locally
  // to avoid making 2 copies.
  const newsSourcesCache = moduleData.newsSourcesCache
  if (newsSourcesCache.length > 0) {
    getNewsSourcesSuccess(newsSourcesCache)
    return
  }
  const http = new Http()
  http.getJSON(
    sourceURL,
    // Set the cache below
    (data) => { getNewsSourcesSuccess(moduleData.newsSourcesCache = data.sources) },
    getNewsSourcesFail
  )
}

const getNewsFromSource = (source, name, getNewsSuccess, getNewsFail) => {
  const http = new Http()
  http.getJSON(
    `${newsURL}?source=${source}&sortBy=top&apiKey=${apiKey}`,
    (data) => { getNewsSuccess(data.articles, name) },
    getNewsFail
  )
}

export { getSources, getNewsFromSource }
