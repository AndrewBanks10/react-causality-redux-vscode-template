/* eslint no-console: 0 */
const handleConfigureRoutes = require('./api/configure')
const handleComponentRoutes = require('./api/component')
const express = require('express')
const path = require('path')

function handleRoutes (app) {
  // cors
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '"Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  // exit server
  app.get('/exit', () => { console.log('Server Exit.'); process.exit(0) })

  // scripts
  const scriptPath = path.join(__dirname, 'scripts')
  app.use('/scripts', express.static(scriptPath))

  // root
  app.get('/', function (req, res) {
    res.sendFile('index.html', {root: __dirname})
  })

  // other routes
  handleConfigureRoutes(app)
  handleComponentRoutes(app)
}

module.exports = handleRoutes
