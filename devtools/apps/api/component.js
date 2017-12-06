const { buildComponent } = require('../processes')

function handleComponentPost (req, res) {
  const config = req.body
  const args = [
    config.defaultDirectory,
    config.useCausalityRedux,
    config.componentName,
    config.generateTestFiles,
    config.useMultiComponent,
    config.useComments,
    config.reactComponentType,
    config.cssFileType
  ]

  buildComponent(
    args,
    () => { res.send({ success: true }) },
    () => { res.send({ success: false }) }
  )
}

function handleComponentRoutes (app) {
  app.post('/component', handleComponentPost)
}

module.exports = handleComponentRoutes
