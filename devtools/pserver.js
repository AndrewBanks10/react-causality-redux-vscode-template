/* eslint no-console: 0 */
const express = require('express')
const app = express()
const prodProxy = require('./prodProxy')

const port = process.env.PORT || 3001
const host = process.env.HOST || 'localhost'

if (typeof process.env.PUBLIC_PATH === 'undefined') {
  throw new Error('process.env.PUBLIC_PATH is not set.')
}

app.use(express.static(process.env.PUBLIC_PATH))

prodProxy(app)

try {
  app.listen(port, host, function () {
    console.log(`devtools/pserver.js listening at http://${host}:${port}.`)
  })
} catch (ex) {
  console.log(`Server error ${ex}.`)
}
