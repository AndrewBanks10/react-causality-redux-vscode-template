/* eslint no-console: 0 */
const childProcess = require('child_process')

let projectConfig = {}

function fulfilledPromise () {
  return new Promise(function (resolve) {
    resolve()
  })
}

function runScript (scriptPath, args, options) {
  return new Promise(function (resolve, reject) {
    let invoked = false
    const process = childProcess.fork(scriptPath, args, options)

    process.on('error', function (err) {
      if (invoked) return
      invoked = true
      reject(err)
    })

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
      if (invoked) return
      invoked = true
      const err = code === 0 ? null : new Error(`exit code ${code}`)
      if (err === null) {
        resolve()
      } else {
        reject(err)
      }
    })
  })
}

function execFileSync (command, args, options) {
  childProcess.execFileSync(command, args, options)
}

function runCreateReactProject () {
  return runScript(
    './devtools/createreactproject.js',
    [true]
  )
}

function runCreateReactComponent (args) {
  return runScript(
    './devtools/createreactcomponent.js',
    args
  )
}

function runWebpack (args, options) {
  const projectConfig = require('../../devtools/projectconfig.js')
  return runScript(
    projectConfig.webpackPath,
    args,
    options
  )
}

function buildDevDll () {
  console.log('Building the development dll files...')
  return runWebpack(
    [
      '--colors',
      '--config',
      './devtools/webpack.config.dlllib.dev.js'
    ],
    {}
  )
}

function buildProdDll () {
  if (!projectConfig.useDllLibraryForProduction) {
    return fulfilledPromise
  }
  console.log('Building the production dll files...')
  return runWebpack(
    [
      '--colors',
      '--config',
      './devtools/webpack.config.dlllib.prod.js'
    ],
    { env: { NODE_ENV: 'production' } }
  )
}

function buildProd () {
  console.log('Building the production files...')
  return runWebpack(
    [
      '--colors',
      '--config',
      './devtools/webpack.config.prod.js'
    ],
    { env: { NODE_ENV: 'production' } }
  )
}

function buildAll (config, success, fail) {
  projectConfig = config
  runCreateReactProject()
    .then(buildDevDll)
    .then(buildProdDll)
    .then(buildProd)
    .then(success)
    .catch(err => { if (typeof fail !== 'undefined') fail(err) })
}

function buildComponent (args, success, fail) {
  runCreateReactComponent(args)
    .then(success)
    .catch(err => { if (typeof fail !== 'undefined') fail(err) })
}

module.exports = {runScript, execFileSync, buildAll, buildComponent}
