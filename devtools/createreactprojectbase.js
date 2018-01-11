/* eslint no-empty:0 */
/* eslint no-console:0 */
const path = require('path')
const fs = require('fs')
const config = require('./webpack.config.config')
let dirsToCreate = []

function writeFile (path, strFile) {
  fs.writeFileSync(path, strFile)
}

function writeJSON (path, jsonFile) {
  writeFile(path, JSON.stringify(jsonFile, null, 2))
}

function readFile (path) {
  return fs.readFileSync(path, 'utf8')
}

function readJSON (path) {
  return JSON.parse(readFile(path))
}

function copyFile (srcPath, destPath) {
  writeFile(destPath, readFile(srcPath))
}

const numRetries = 20
function mkdir (directory) {
  for (let i = 0; i < numRetries; ++i) {
    try {
      fs.mkdirSync(directory)
      return
    } catch (ex) {
      if (ex.code === 'EEXIST') {
        return
      }
    }
  }
}

const newLine = () =>
  `
`
const spaces = (amt) => {
  let str = ''
  for (let i = 0; i < amt; ++i) {
    str += ' '
  }
  return str
}

const reactComponentsPath = path.join(config.sourceDir, config.reactComponentsDirectory)
const bootPath = path.join(config.sourceDir, 'bootstrap')

const useReactRouter = () =>
  config.useReactRouterWithTimeTravel || config.useReactRouterWithoutTimeTravel

const codeFileName = templateName =>
  config.useTypeScript ? `${templateName}.ts` : `${templateName}.js`

const reactFileName = templateName =>
  config.useTypeScript ? `${templateName}.tsx` : `${templateName}.jsx`

function makeDirectories () {
  if (!fs.existsSync(dirsToCreate[0])) {
    throw new Error(`Failed to create the directory: /${dirsToCreate[0]}/`)
  }
  dirsToCreate.shift()
  if (dirsToCreate.length === 0) {
    finishConfiguration()
    return
  }
  fs.mkdir(dirsToCreate[0], makeDirectories)
}

function handleDirectories () {
  dirsToCreate.push(config.sourceDir)
  dirsToCreate.push(config.testDirectory)
  dirsToCreate.push(config.buildDir)
  dirsToCreate.push(reactComponentsPath)
  dirsToCreate.push(bootPath)
  dirsToCreate.push(path.join(config.sourceDir, config.assetsDirectory))
  if (config.useCSSModules === 2) {
    dirsToCreate.push(path.join(config.sourceDir, config.noCSSModulesName))
  }
  fs.mkdir(dirsToCreate[0], makeDirectories)
}

function handleTsConfig () {
  if (!config.useTypeScript) {
    return
  }
  const tsLintFile =
`{
  "extends": "tslint-config-standard",
  "rules": {
    "strict-type-predicates": false
  }
}
`

  const tsConfigFile =
`{
  "compilerOptions": {
    "outDir": "./${config.buildDir}/",
    "sourceMap": true,
    "module": "commonjs",
    "target": "es5",
    "lib": ["dom", "es2015.promise", "es2015"],
    "jsx": "react",
    "baseUrl": "."
  },
  "include": [
    "./${config.sourceDir}/**/*.ts",
    "./${config.sourceDir}/**/*.tsx"
  ]
}
`
  const testTsConfigFile =
`{
  "compilerOptions": {
    "sourceMap": true,
    "module": "commonjs",
    "target": "es5",
    "jsx": "react",
    "allowJs": true,
    "baseUrl": "."
  },
  "include": [
  ]
}
`
  writeFile(path.join('./', 'tslint.json'), tsLintFile)
  writeFile(path.join('./', 'tsconfig.json'), tsConfigFile)
  writeFile(path.join('./test', 'tsconfig.json'), testTsConfigFile)
}

function handleStylesheets () {
  //
  // Use global stylesheets
  //
  if (config.useCSSModules !== 1) {
    const cssFile =
`//
// TODO: Import stylesheets here that do not support modules.
// Used for global stylesheets. They will be in the '${config.noCSSModulesName}' directory.
// Note. If you do not import them here then they will not be included in the build.
//

// Example import '../${config.noCSSModulesName}/header.1';

// hot re-load support for the css above.
if (module.hot) {
  module.hot.accept()
}
`
    writeFile(path.join(bootPath, codeFileName('css')), cssFile)
  }
}

function handleIndexFile () {
  let indexFile =
`<!doctype html>
<html lang="en">
<head>
  <title>React Project</title>
  <meta charset="utf-8">
  <meta name="author" content="Andrew Banks">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#ffffff"/>
`
  if (config.isProgressiveWebApp) {
    indexFile += `  <link rel="manifest" href="./manifest.json">
`
  }
  indexFile +=
`</head>

<body>
  <div id="${config.reactRootId}">
  </div>
  <noscript>Your browser does not support JavaScript!</noscript>
</body>

</html>
`
  writeFile(path.join('devtools', 'index.ejs'), indexFile)
}

function handleIndexCommon () {
  //
  // index-common.js
  //
  let indexCommon = `import './libs'
`
  if (config.useTypeScript) {
    indexCommon += `import * as React from 'react'
import * as injectTapEventPlugin from 'react-tap-event-plugin'`
  } else {
    indexCommon += `import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'`
  }

  indexCommon += `
import { render } from 'react-dom'
`

  if (config.useCSSModules !== 1) {
    indexCommon += 'import \'./css\''
    indexCommon += newLine()
  }

  if (config.useCausalityRedux) {
    indexCommon += 'import { globalPartitionState } from \'../causality-redux/init\''
    indexCommon += newLine()
  }

  indexCommon += `import App from '../${config.reactComponentsDirectory}/App'`
  indexCommon += newLine()
  indexCommon += newLine()

  if (config.useCausalityRedux) {
    indexCommon += `if (!globalPartitionState.injectTapEventPlugin) {
  globalPartitionState.injectTapEventPlugin = true
  injectTapEventPlugin()
}

`
  } else {
    indexCommon += 'injectTapEventPlugin()'
    indexCommon += newLine()
  }

  indexCommon +=
`const reactRootId = '${config.reactRootId}'
const reactMountNode = document.getElementById(reactRootId)

export { App, React, render, reactMountNode }
export default App
`

  writeFile(path.join(bootPath, codeFileName('index-common')), indexCommon)

  let code = `// Put your polyfills here.
// Also list them using the configuration program in the dll library section
// so that debug compilation is faster.

// React 16 requirements.
import 'core-js/es6/map'
import 'core-js/es6/set'

import 'whatwg-fetch'
import { shim as assignShim } from 'object.assign'
import { shim as fromShim } from 'array.from'
import Promise from 'promise-polyfill'

if (!window['Promise']) {
  window['Promise'] = Promise
}

assignShim()
fromShim()
`
  writeFile(path.join(bootPath, codeFileName('libs')), code)
}

function handleDllLibraries () {
  const dllFiles = ['react', 'react-dom', 'react-tap-event-plugin']
  if (config.useCausalityRedux) {
    if (config.useTypeScript) {
      dllFiles.push('source-map')
    }
    dllFiles.push('redux')
    dllFiles.push('react-redux')
    dllFiles.push('causality-redux')
    dllFiles.push('react-causality-redux')
  }
  if (useReactRouter()) {
    if (config.useReactRouterWithTimeTravel) {
      dllFiles.push('react-causality-redux-router')
    }
    dllFiles.push('react-router-dom')
    dllFiles.push('history')
  }
  if (config.useMaterialUI) {
    dllFiles.push('material-ui')
  }

  let dllFile = 'module.exports = ['

  for (let i = 0; i < dllFiles.length; ++i) {
    if (i !== 0) {
      dllFile += ','
    }
    dllFile += newLine()
    dllFile += spaces(2)
    dllFile += `'${dllFiles[i]}'`
    if (i === dllFiles.length - 1) {
      dllFile += newLine()
    }
  }

  dllFile += ']'
  dllFile += newLine()
  writeFile(path.join('devtools', 'projectdllmodules.js'), dllFile)
}

function handleHistoryFile () {
  if (useReactRouter()) {
    mkdir(path.join(config.sourceDir, 'history'))
    let historyfile = ''
    if (config.useCausalityRedux) {
      if (config.useReactRouterWithTimeTravel) {
        historyfile += 'import createBrowserHistory from \'react-causality-redux-router\''
      } else {
        historyfile += 'import { createBrowserHistory } from \'history\''
      }
      historyfile += newLine()
    } else {
      historyfile += 'import { createBrowserHistory } from \'history\''
      historyfile += newLine()
    }
    historyfile += 'const history = createBrowserHistory()'
    historyfile += newLine()
    historyfile += 'export default history'
    historyfile += newLine()
    writeFile(path.join(config.sourceDir, 'history', codeFileName('history')), historyfile)
  }
}

function handleCausalityRedux () {
  //
  // causality-redux/init.js
  //
  if (!config.useCausalityRedux) {
    return
  }
  const dir = path.join(config.sourceDir, 'causality-redux')
  fs.mkdirSync(dir)
  let cr =
`import causalityRedux from 'causality-redux'
import 'react-causality-redux'

// Use this if you need global data. It survives HMR.
const globalData = {
`
  if (config.useTypeScript) {
    cr += `  isTypescript: true,
`
  }
  cr += `  injectTapEventPlugin: false
}

// globalPartitionState - Access and set individual key values in the global store.
// globalSetState = Set multiple key values in the global store.
// globalGetState - Get global store object.
// globalSubscribe - Subscribe to changes to key values in the global store.
// globalSubscribe(listener: function, globalStoreKeys = [], listenerName = '')
// If globalStoreKeys == [] or undefined, listen to all keys in the global partition.
const { globalPartitionState, globalSetState, globalGetState, globalSubscribe } = causalityRedux.createGlobalStore(globalData)

export { globalPartitionState, globalSetState, globalGetState, globalSubscribe }
`
  writeFile(path.join(dir, codeFileName('init')), cr)
}

function handleApp () {
  //
  // App.js
  //
  let App = ''
  if (config.useTypeScript) {
    App += `import * as React from 'react'
`
  } else {
    App += `import React from 'react'
`
  }

  if (config.useCausalityRedux) {
    App += `import causalityRedux from 'causality-redux'
import { Provider } from 'react-redux'
`
  }

  if (useReactRouter()) {
    App += 'import { Router } from \'react-router-dom\''
    App += newLine()
    App += 'import history from \'../history/history\''
    App += newLine()
  }

  if (config.useMaterialUI) {
    App += `import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
`
  }

  App += `import MainApp from './MainApp/MainApp'

const App = () =>
`

  let indentSpaces = 2
  const tagstack = []
  const closeTagstack = []

  if (config.useCausalityRedux) {
    tagstack.push({
      str: `<Provider store={causalityRedux.store}>
`,
      indentSpaces
    })
    closeTagstack.push('</Provider>')
    indentSpaces += 2
  }

  if (useReactRouter()) {
    tagstack.push({
      str: `<Router history={history}>
`,
      indentSpaces
    })
    closeTagstack.push('</Router>')
    indentSpaces += 2
  }

  if (config.useMaterialUI) {
    tagstack.push({
      str: `<MuiThemeProvider>
`,
      indentSpaces
    })
    closeTagstack.push('</MuiThemeProvider>')
    indentSpaces += 2
  }

  for (let i = 0; i < tagstack.length; ++i) {
    App += spaces(tagstack[i].indentSpaces)
    App += tagstack[i].str
  }

  App += spaces(indentSpaces)
  App += '<MainApp />'
  if (tagstack.length > 0) {
    App += newLine()
  }

  for (let i = tagstack.length - 1; i >= 0; --i) {
    App += spaces(tagstack[i].indentSpaces)
    App += closeTagstack[i]
    if (i !== 0) {
      App += newLine()
    }
  }

  App += `

export default App
`
  writeFile(path.join(reactComponentsPath, reactFileName('App')), App)
}

function handleMainApp () {
  //
  // MainApp
  //
  const mainAppPath = path.join(reactComponentsPath, 'MainApp')
  mkdir(mainAppPath)

  let mainApp = ''
  if (!config.useTypeScript) {
    mainApp += 'import React from \'react\''
  } else {
    mainApp += 'import * as React from \'react\''
  }

  mainApp += newLine()

  if (useReactRouter()) {
    mainApp += `
import { Switch, /* Route, */ Redirect } from 'react-router-dom'

// TODO: Put your route strings here so that they may be imported from this module
// when a router <Link> is needed
export const HOMEROUTE = '/'

const MainApp = () =>
  <Switch>
    {/* TODO: Put your routes here example: <Route exact path={HOMEROUTE} component={HomeApp} /> */}
    <Redirect to={HOMEROUTE} />
  </Switch>
`
  } else {
    mainApp += `
const MainApp = () =>
  <div>
    TODO: Put your react component(s) here
  </div>
`
  }

  mainApp += newLine()
  mainApp += 'export default MainApp'
  mainApp += newLine()

  writeFile(path.join(mainAppPath, reactFileName('MainApp')), mainApp)
}

function buildServerIndexFiles () {
  let index =
`import { React, render, App, reactMountNode } from './bootstrap/index-common'
`
  if (config.isProgressiveWebApp) {
    index += `import registerServiceWorker from './bootstrap/registerServiceWorker'
`
  }

  index += `
render(
  <App />,
  reactMountNode
)
`

  if (config.isProgressiveWebApp) {
    index += `registerServiceWorker()
`
  }
  if (config.useTypeScript) {
    writeFile(path.join(config.sourceDir, 'index.tsx'), index)
  } else {
    writeFile(path.join(config.sourceDir, 'index.js'), index)
  }

  const indexDev =
        `import { React, render, App, reactMountNode } from './bootstrap/index-common'
import { AppContainer } from 'react-hot-loader'

//
// The below is the necessary technique to utilize hot re-loading of react.
//
const renderRoot = (TheApp) => {
  render(
    <AppContainer warnings={false}>
      <TheApp />
    </AppContainer>,
    reactMountNode
  )
}

// First module render.
renderRoot(App)

//
// Hot reload support for react. If any of the react components change this will
// hot reload all changed components and then re-render the root
//
if (module.hot) {
  module.hot.accept('./bootstrap/index-common', () => {
    // The below requires the location of App or whatever is used for the root component
    // The require('./bootstrap/index-common') brings in a new copy of the App module.
    // react will handle keeping the props and state the same after the load.
    renderRoot(require('./bootstrap/index-common').default)
  })
}
`
  if (config.useTypeScript) {
    writeFile(path.join(config.sourceDir, 'index.dev.tsx'), indexDev)
  } else {
    writeFile(path.join(config.sourceDir, 'index.dev.js'), indexDev)
  }
}

function handleTestDirectory () {
  let setup =
        `const { JSDOM } = require('jsdom')

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
})
`
  if (config.useTypeScript) {
    setup += `
export interface Global {
  document: Document
  window: Window
  requestAnimationFrame: any
  navigator: any
}
declare const global: Global
`
  }
  setup += `
const { window } = jsdom
global.window = window
global.document = window.document

//
// Put all of your window features that are missing from jsdom that you need here.
//
if (typeof window.fetch === 'undefined') {
  global['self'] = window
  require('whatwg-fetch')
  delete global['self']
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
`

  writeFile(path.join('test', codeFileName('setup')), setup)

  let reacttest = `
import { React, App } from '../${config.sourceDir}/bootstrap/index-common'
import Adapter from 'enzyme-adapter-react-16'
import { configure, mount } from 'enzyme'

configure({ adapter: new Adapter() })

// Mount the App
const appMount = mount(<App />)

export default appMount
`

  writeFile(path.join('test', reactFileName('mountapp')), reacttest)

  let dataObj = 'new Date()'
  if (config.useTypeScript) {
    dataObj = 'new Date() as any'
  }
  const projectsetup =
`import appMount from './mountapp'

const waitTime = 2000
let intervalID

//
// React rendering is asynchronous. Components must be validated asynchronously.
//
const handleReactAsync = (done, startTime, waitTime, callbackCheck) => {
  // The callback checks that the conditions for success have been met
  if (callbackCheck()) {
    clearInterval(intervalID)
    done()
  // Timeout means failure.
  } else if (${dataObj} - startTime > waitTime) {
    clearInterval(intervalID)
    done(new Error('Timeout'))
  }
  update()
}

const handleReactAsyncStart = (done, waitTime, callbackCheck) => {
  intervalID = setInterval(handleReactAsync, 10, done, new Date(), waitTime, callbackCheck)
}

const findNode = selector => {
  if (typeof selector === 'function') {
    return appMount.findWhere(selector)
  }
  return appMount.find(selector)
}

export const findNodeFunction = (type, id) =>
  n => n.type() === type && n.props().id === id

export const nodeExists = selector => findNode(selector).first().exists()
export const nodeString = selector => findNode(selector).first().text()
export const nodeValue = selector => findNode(selector).props().value
export const simulateClick = selector => findNode(selector).first().simulate('click')
export const simulateInput = (selector, value) => findNode(selector).first().simulate('change', { target: { value } })
export const update = () => appMount.update()
export { appMount }

export const testCauseAndEffectWithExists = (causeSelector, effectSelector, done) => {
  simulateClick(causeSelector)
  handleReactAsyncStart(done, waitTime, () =>
    nodeExists(effectSelector)
  )
}

export const testCauseAndEffectWithNotExists = (causeSelector, effectSelector, done) => {
  simulateClick(causeSelector)
  handleReactAsyncStart(done, waitTime, () =>
    !nodeExists(effectSelector)
  )
}

export const testCauseAndEffectWithHtmlString = (causeSelector, effectSelector, expectedHtmlString, done) => {
  simulateClick(causeSelector)
  handleReactAsyncStart(done, waitTime, () =>
    nodeString(effectSelector) === expectedHtmlString
  )
}

export const testCauseAndEffectWithTextField = (causeSelector, inputValue, expectedValue, done) => {
  simulateInput(causeSelector, inputValue)
  handleReactAsyncStart(done, waitTime, () =>
    nodeValue(causeSelector) === expectedValue
  )
}
`

  writeFile(path.join('test', codeFileName('projectsetup')), projectsetup)
}

const handleLaunchJson = () => {
  const launchPath = path.join('.vscode', 'launch.json')
  const launchJSON = readJSON(launchPath)

  let mochaLocation = config.mochaPath
  mochaLocation = mochaLocation.replace(/\\/g, '/')
  if (mochaLocation.charAt(0) !== '/') {
    if (mochaLocation.charAt(0) === '.') {
      mochaLocation = mochaLocation.slice(1)
    }
    if (mochaLocation.charAt(0) === '/') {
      mochaLocation = mochaLocation.slice(1)
    }
    mochaLocation = '$' + '{workspaceRoot}/' + mochaLocation
  }

  let mochaTestArgs = [
    '--require',
    'babel-register',
    '--require',
    'ignore-styles',
    '--require',
    './test/setup.js',
    './test/mountapp.jsx',
    './test/projectsetup.js',
    './src/**/*spec.js',
    '--no-timeouts',
    '--colors'
  ]

  if (config.useTypeScript) {
    mochaTestArgs = [
      '--require',
      'ts-node/register',
      '--require',
      'ignore-styles',
      '--require',
      './test/setup.ts',
      './test/mountapp.tsx',
      './test/projectsetup.ts',
      './src/**/*spec.ts',
      '--no-timeouts',
      '--colors'
    ]
  }

  launchJSON.configurations.forEach(entry => {
    if (entry.name === 'Run Mocha Tests') {
      entry.program = mochaLocation
      entry.args = mochaTestArgs
    }
  })

  writeJSON(launchPath, launchJSON)
}

const handlePackageJson = () => {
  const filePath = path.join('./', 'package.json')
  let packageObj = readJSON(filePath)

  let testEntry = 'cross-env NODE_ENV=mochaTesting mocha --require babel-register --require ignore-styles --require test/setup.js test/projectsetup.js test/mountapp.jsx src/**/*.spec.js --no-timeouts'
  if (config.useTypeScript) {
    testEntry = 'cross-env NODE_ENV=mochaTesting TS_NODE_PROJECT=./test/tsconfig.json mocha --require ts-node/register --require ignore-styles --require test/setup.ts test/projectsetup.ts test/mountapp.tsx src/**/*.spec.ts --no-timeouts'
  }
  packageObj.scripts.test = testEntry

  let compileSrc = 'babel ./test/**/*.js ./test/**/*.jsx ./src/**/*.js ./src/**/*.jsx --out-dir temp --source-maps --watch'
  if (config.useTypeScript) {
    compileSrc = 'tsc --outDir temp --sourceMap --watch'
  }
  packageObj.scripts['compile:src'] = compileSrc

  if (config.useTypeScript) {
    packageObj.scripts.lint = 'tslint --project tsconfig.json src/**/*.ts?(x)'
  } else {
    packageObj.scripts.lint = 'eslint src/**'
  }

  writeJSON(filePath, packageObj)
}

const handleProductionServer = () => {
  const code = `/* eslint no-console: 0 */
const express = require('express')
const app = express()

const port = process.env.PORT || 3001
const host = process.env.HOST || 'localhost'

if (typeof process.env.PUBLIC_PATH === 'undefined') {
  throw new Error('process.env.PUBLIC_PATH is not set.')
}

app.use(express.static(process.env.PUBLIC_PATH))

// Remove the STARTPROXY comment below if you customized your proxy definitions so that the configure program
// does not overwrite it.
// STARTPROXY
// ENDPROXY

try {
  app.listen(port, host, function () {
    console.log(\`devtools/pserver.js listening at http://\${host}:\${port}.\`)
  })
} catch (ex) {
  console.log(\`Server error \${ex}.\`)
}
`
  writeFile(path.join('devtools', 'pserver.js'), code)
}

const handleProductionProxies = () => {
  const pserverPath = path.join('devtools', 'pserver.js')
  if (!fs.existsSync(pserverPath)) {
    return
  }
  let file = readFile(pserverPath)

  const index1 = file.indexOf('// STARTPROXY')
  if (index1 === -1) {
    return
  }
  let index2 = file.indexOf('// ENDPROXY')
  if (index2 === -1) {
    return
  }

  const firstPart = file.slice(0, index1)
  const lastPart = file.slice(index2)

  if (!config.prodProxyList) {
    writeFile(pserverPath, firstPart + `// STARTPROXY
` + lastPart)
    return
  }

  let code = `// STARTPROXY
//
// Handle the proxy.
//
const childProcess = require('child_process')
const proxy = require('http-proxy-middleware')

const proxyPort = ${config.prodProxyPort}
const proxyURL = '${config.prodProxyURL}'

// Start the proxy server
childProcess.fork('${config.prodProxyServerPathName}', [proxyURL, proxyPort.toString()])

// Implement the proxy
const theProxy = \`${config.prodProxyURL}:${config.prodProxyPort}\`

const endPoints = [
`
  let args = config.prodProxyList
  args = args.replace(/'/g, '')
  args = args.replace(/ /g, '')
  args = args.split(',')
  for (let i = 0; i < args.length; ++i) {
    code += `  '${args[i]}'`
    if (i !== args.length - 1) {
      code += ','
    }
    code += '\r\n'
  }

  code += `]

endPoints.forEach(e =>
  app.use(e, proxy({ target: theProxy }))
)
`
  writeFile(pserverPath, firstPart + code + lastPart)
}

const handleDevelopmentProxies = () => {
  let filePath = path.join('./', 'package.json')
  let packageObj = readJSON(filePath)
  if (!config.devProxyServerPathName) {
    packageObj.scripts.start = 'cross-env NODE_ENV=development node devtools/server.js'
  } else {
    packageObj.scripts.start = `cross-env NODE_ENV=development node devtools/runservers.js devtools/server.js ${config.devProxyServerPathName}`
  }
  writeJSON(filePath, packageObj)

  filePath = path.join('devtools', 'webpack.config.dev.js')
  let file = readFile(filePath)
  const index1 = file.indexOf('    // STARTPROXY')
  if (index1 === -1) {
    return
  }
  let index2 = file.indexOf('    // ENDPROXY')
  if (index2 === -1) {
    return
  }

  const firstPart = file.slice(0, index1)
  const lastPart = file.slice(index2)

  if (!config.devProxyList) {
    writeFile(filePath, firstPart + `    // STARTPROXY
` + lastPart)
    return
  }

  let args = config.devProxyList
  args = args.replace(/'/g, '')
  args = args.replace(/ /g, '')
  args = args.split(',')
  let proxyArgs = ''
  for (let i = 0; i < args.length; ++i) {
    proxyArgs += `'${args[i]}'`
    if (i !== args.length - 1) {
      proxyArgs += ', '
    }
  }

  let code =
`    // STARTPROXY
    proxy: [{
      context: [${proxyArgs}],
      target: '${config.devProxyURL}:${config.devProxyPort}'
    }],
`
  writeFile(filePath, firstPart + code + lastPart)
}

const handleProgressiveApp = () => {
  if (!config.isProgressiveWebApp) {
    return
  }
  const fileName = 'registerServiceWorker.js'
  const srcPath = path.join('devtools', fileName)
  const destPath = path.join(bootPath, fileName)

  if (!fs.existsSync(destPath)) {
    copyFile(srcPath, destPath)
  }

  const filePath = path.join(config.buildDir, 'manifest.json')
  const code = `{
  "short_name": "React PWA",
  "name": "React PWA",
  "icons": [
    {
      "src": "logo.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": "./index.html",
  "display": "standalone",
  "theme_color": "#ffffff",
  "background_color": "#ffffff"
}
`
  writeFile(filePath, code)
}

function finishConfiguration () {
  try {
    handlePackageJson()
    handleProductionServer()
    handleStylesheets()
    handleIndexFile()
    handleIndexCommon()
    handleDllLibraries()
    handleCausalityRedux()
    handleApp()
    handleMainApp()
    buildServerIndexFiles()
    handleHistoryFile()
    handleTestDirectory()
    handleTsConfig()
    handleProductionProxies()
    handleProgressiveApp()
  } catch (msg) {
    console.log(`Create Error: ${msg}`)
  }
}

module.exports = function buildProject (isUI) {
  handleProductionProxies()
  handleDevelopmentProxies()
  handleLaunchJson()

  if (fs.existsSync(config.sourceDir)) {
    if (!isUI) {
      console.log('The project has already been created.')
    }
    return false
  }
  console.log('Creating the react project...')
  try {
    handleDirectories()
  } catch (msg) {
    console.log(`Create Error: ${msg}`)
  }

  console.log('React project created.')
  return true
}
