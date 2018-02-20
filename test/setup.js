const { JSDOM } = require('jsdom')

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
})

const { window } = jsdom
global.window = window
global.document = window.document

//
// Put all of your window features that are missing from jsdom that you need here.
//
if (typeof window.LocalStorage === 'undefined' || window.localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage
  window.localStorage = new LocalStorage('./test/temp')
}

//
// Testing for react 16.
//
global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0)
}

Object.keys(global.window).forEach(property => {
  if (typeof global[property] === 'undefined') {
    global[property] = global.window[property]
  }
})

global.navigator = {
  userAgent: 'node.js'
}
