const sourceURL = 'https://newsapi.org/v1/sources?language=en'
const newsURL = 'https://newsapi.org/v1/articles'

// Please do not use my key. Go here to get your own.
// https://newsapi.org
const apiKey = 'ce36820a866d431f82a1dd77c56592cb'

const getSources = (getNewsSourcesSuccess, getNewsSourcesFail) => {
  fetch(sourceURL).then(function (response) {
    return response.json()
  }).then(function (data) {
    getNewsSourcesSuccess(data.sources)
  }).catch(function () {
    getNewsSourcesFail()
  })
}

const getNewsFromSource = (source, name, getNewsSuccess, getNewsFail) => {
  fetch(`${newsURL}?source=${source}&sortBy=top&apiKey=${apiKey}`).then(function (response) {
    return response.json()
  }).then(function (data) {
    getNewsSuccess(data.articles, name)
  }).catch(function () {
    getNewsFail()
  })
}

export { getSources, getNewsFromSource }
