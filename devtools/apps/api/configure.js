/* eslint no-console: 0 */
const fs = require('fs')
const handleDllLibraries = require('../../createDllLibraryFiles')

const configurationFile = './devtools/projectconfig.json'
const configurationJSFile = './devtools/projectconfig.js'

function handleConfigureGet (req, res) {
  if (!fs.existsSync(configurationFile)) {
    res.send('{}')
    return
  }
  res.send(fs.readFileSync(configurationFile))
}

function handleConfigurePost (req, res) {
  const config = req.body
  const strConfig = JSON.stringify(config)
  fs.writeFileSync(configurationFile, strConfig)
  fs.writeFileSync(configurationJSFile, `module.exports = ${strConfig};`)
  handleDllLibraries(config)

  const { buildAll } = require('../processes')
  buildAll(
    config,
    () => { console.log('Build Successful.'); res.send({ success: true }) },
    () => { console.log('Build Failed.'); res.send({ success: false }) }
  )
}

function handleConfigureRoutes (app) {
  app.get('/configure', handleConfigureGet)
  app.post('/configure', handleConfigurePost)
}

module.exports = handleConfigureRoutes
