let httpReq = null
const url = 'https://jsonplaceholder.typicode.com/todos'

// All this effort is for abort logic and fetch does not support it.
const Http = (function () {
  const errorMsg = 'Unknown network error.'

  function internalCallback (evt) {
    this.req = null
    if (evt.target.status !== 200) {
      if (typeof this._errorCallback === 'function') {
        this._errorCallback(errorMsg)
      }
      return
    }
    this._callback(JSON.parse(evt.target.response))
  }

  function Http () {
    this.req = null
    this._callback = null
    this._errorCallback = null
  }

  Http.prototype = {
    constructor: Http,

    get: function (url, callback, errorCallback) {
      this._callback = callback
      this._errorCallback = errorCallback
      const req = new XMLHttpRequest()
      req.open('GET', url, true)
      req.addEventListener('load', internalCallback.bind(this), false)
      req.addEventListener('error', function () { this.req = null; errorCallback(errorMsg) }, false)
      req.send(null)
      this.req = req
    },

    abort: function () {
      if (this.req) {
        this.req.abort()
      }
      this.req = null
    }
  }
  return Http
})()

function handleGetReceived (arg, successCallback) {
  if (httpReq === null) {
    return
  }
  httpReq = null
  successCallback(arg)
}

export function handleGet (success, fail) {
  httpReq = new Http()
  httpReq.get(
    url,
    (arg) => { setTimeout(handleGetReceived, 2000, arg, success) }, // Allows abort testing.
    fail
  )
}

export function handleAbort () {
  if (httpReq) {
    httpReq.abort()
  }
  httpReq = null
}
