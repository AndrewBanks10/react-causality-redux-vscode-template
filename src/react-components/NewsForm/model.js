const sourceURL = 'https://newsapi.org/v1/sources?language=en'
const newsURL = 'https://newsapi.org/v1/articles'

// Please do not use my key. Go here to get your own.
// https://newsapi.org
const apiKey = 'ce36820a866d431f82a1dd77c56592cb'

const getSources = (getNewsSourcesSuccess, getNewsSourcesFail) => {
  fetch(sourceURL).then(response =>
    response.json()
  ).then(data =>
    getNewsSourcesSuccess(data.sources)
  ).catch(function () {
    getNewsSourcesFail()
  })
}

const getNewsFromSource = (source, name, getNewsSuccess, getNewsFail) => {
  fetch(`${newsURL}?source=${source}&sortBy=top&apiKey=${apiKey}`).then(response =>
    response.json()
  ).then(data =>
    getNewsSuccess(data.articles, name)
  ).catch(function () {
    getNewsFail()
  })
}

export { getSources, getNewsFromSource }
