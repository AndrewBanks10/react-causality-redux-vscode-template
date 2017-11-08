const Http = (function () {
  const error = status =>
    `Network error: ${status}`

  function internalCallback (evt) {
    let response
    let status
    // Kludge for mocha testing.
    if (typeof evt === 'undefined') {
      response = this.responseText
      status = this.status
    } else {
      response = evt.target.response
      status = evt.target.status
    }
    this.req = null
    if (status !== 200) {
      if (typeof this._fail === 'function') {
        this._fail(error(status))
      }
      return
    }
    if (typeof this._success === 'function') {
      this._success(response)
    }
  }

  function Http () {
    this.req = null
    this._success = null
    this._fail = null
  }

  function httpRequest (request) {
    this._success = request.success
    this._fail = request.fail

    const req = new XMLHttpRequest()
    req.open(request.verb, request.url, true)
    if (typeof request.applicationType !== 'undefined') {
      req.setRequestHeader('Content-type', request.applicationType)
    }
    if (typeof request.responseType !== 'undefined') {
      req.responseType = request.responseType
    }
    req.addEventListener('load', internalCallback.bind(this), false)
    if (typeof request.progress === 'function') {
      req.addEventListener('progress', request.progress.bind(this), false)
    }
    if (typeof request.fail === 'function') {
      req.addEventListener('error', () => {
        this.req = null
        request.fail(error('Unknown'))
      },
      false)
    }
    req.send(request.data)
    this.req = req
  }

  const defaultArgs = (obj) => {
    if (typeof obj.url === 'string') {
      return obj
    }
    return obj.url
  }

  function jsonSendRequest (obj) {
    obj.applicationType = 'application/json'
    obj.data = JSON.stringify(obj.data)
    httpRequest.bind(this)(obj)
  }

  Http.prototype = {
    constructor: Http,

    // Get an object
    get: function (url, success, fail, progress) {
      httpRequest.bind(this)(defaultArgs({ url, success, fail, progress, verb: 'GET' }))
    },

    getJSON: function (url, success, fail, progress) {
      const obj = defaultArgs({ url, success, fail, progress, verb: 'GET' })
      obj.responseType = 'json'
      httpRequest.bind(this)(obj)
    },

    // Update an entire object
    put: function (url, data, applicationType, responseType, success, fail, progress) {
      httpRequest.bind(this)(defaultArgs({url, data, applicationType, responseType, success, fail, progress, verb: 'PUT'}))
    },

    putJSON: function (url, data, success, fail, progress) {
      const obj = defaultArgs({ url, data, success, fail, progress, verb: 'PUT' })
      obj.responseType = 'json'
      jsonSendRequest.bind(this)(obj)
    },

    // Update a partial object
    patch: function (url, data, applicationType, responseType, success, fail, progress) {
      httpRequest.bind(this)(defaultArgs({url, data, applicationType, responseType, success, fail, progress, verb: 'PATCH'}))
    },

    // Update a partial object
    patchJSON: function (url, data, applicationType, responseType, success, fail, progress) {
      const obj = defaultArgs({ url, data, success, fail, progress, verb: 'PATCH' })
      obj.responseType = 'json'
      jsonSendRequest.bind(this)(obj)
    },

    // Create a new object
    post: function (url, data, applicationType, responseType, success, fail, progress) {
      httpRequest.bind(this)(defaultArgs({url, data, applicationType, responseType, success, fail, progress, verb: 'POST'}))
    },

    postJSON: function (url, data, success, fail, progress) {
      const obj = defaultArgs({ url, data, success, fail, progress, verb: 'POST' })
      obj.responseType = 'json'
      jsonSendRequest.bind(this)(obj)
    },

    // Delete an object
    delete: function (url, success, fail, progress) {
      httpRequest.bind(this)(defaultArgs({ url, success, fail, progress, verb: 'DELETE' }))
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

export default Http
