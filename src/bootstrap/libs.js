// Put your polyfills here.
// Also list them using the configuration program in the dll library section
// so that debug compilation is faster.

// React 16 requirements.
import 'core-js/es6/map'
import 'core-js/es6/set'

import 'whatwg-fetch'
import { shim as assignShim } from 'object.assign'
import { shim as fromShim } from 'array.from'
import Promise from 'promise-polyfill'

if (!window.Promise) {
  window.Promise = Promise
}

assignShim()
fromShim()
