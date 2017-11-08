const fs = require('fs')
const path = require('path')

function writeFile (directory, strFile) {
  fs.writeFileSync(directory, strFile)
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

const useReactRouter = (config) =>
  config.useReactRouterWithTimeTravel || config.useReactRouterWithoutTimeTravel

module.exports = function handleDllLibraries (config) {
  const dllFiles = ['react', 'react-dom', 'react-tap-event-plugin']
  if (config.useCausalityRedux) {
    dllFiles.push('redux')
    dllFiles.push('react-redux')
    dllFiles.push('causality-redux')
    dllFiles.push('react-causality-redux')
  }
  if (useReactRouter(config)) {
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
    dllFile += spaces(4)
    dllFile += `'${dllFiles[i]}'`
    if (i === dllFiles.length - 1) {
      dllFile += newLine()
    }
  }

  dllFile += '];'
  writeFile(path.join('devtools', 'projectdllmodules.js'), dllFile)
}
