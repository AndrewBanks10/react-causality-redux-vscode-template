const path = require('path')
const projectConfig = require('./projectconfig')
const projectDllModules = require('./projectdllmodules')

const config = Object.assign({}, projectConfig)

config.basePath = process.cwd()

// At this time, the source directory must be directly below the vscode directory.
config.absoluteSourcePath = path.join(config.basePath, config.sourceDir)

// At this time, you must have your node_modules directory in or above the project directory.
// The setting below makes that assumption.
config.node_modulesPath = 'node_modules'

config.stylesheetTypes = []
if (config.useLess) {
  config.stylesheetTypes.push('less')
}
if (config.useSass) {
  config.stylesheetTypes.push('sass')
}
if (config.useCss) {
  config.stylesheetTypes.push('css')
}

config.urlLoaderExtensions = config.strUrlLoaderExtensions.split(', ')
config.resolveExtensions = config.strResolveExtensions.split(', ')
config.dllModules = config.strDllModule.split('\n').map(e => e.trim().toLowerCase()).filter(e => e !== '')
config.dllModules = config.dllModules.concat(projectDllModules)
config.testDirectory = 'test'

// At this time, the build directory must be directly below the vscode directory.
config.absoluteBuildPath = path.join(config.basePath, config.buildDir)
config.absoluteBuildScriptsPath = path.join(config.absoluteBuildPath, config.buildScriptDir)
config.absoluteDevToolsPath = path.join(config.basePath, 'devtools')

// At this time, the dll directory must be directly below the vscode directory.
config.absoluteDllPath = path.join(config.basePath, config.dllDir)

// Set the program entry point of your development/debug environents
if (config.useTypeScript) {
  if (process.env.NODE_ENV === 'production') {
    config.entryJs = 'index.tsx'
  } else {
    config.entryJs = 'index.dev.tsx'
  }
} else {
  if (process.env.NODE_ENV === 'production') {
    config.entryJs = 'index.js'
  } else {
    config.entryJs = 'index.dev.js'
  }
}

module.exports = config
