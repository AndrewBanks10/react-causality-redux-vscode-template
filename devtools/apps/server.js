/* eslint no-console: 0 */
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const handleRoutes = require('./routes')
const opn = require('opn')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT || 3010
const host = process.env.HOST || 'localhost'

try {
  app.listen(port, host, function () {
    handleRoutes(app)
    console.log(`Listening at http://${host}:${port}.`)
  })

  opn(`http://${host}:${port}`).then(() => {

  })
} catch (ex) {
  console.log(`Server error ${ex}.`)
}

process.on('uncaughtException', function (err) {
  console.log(`Server exception: ${err}.`)
  console.log('Server exiting.')
  process.exit(0)
})
