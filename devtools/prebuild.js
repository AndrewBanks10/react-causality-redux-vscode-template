const path = require('path')
const fs = require('fs')
const configCommon = require('./webpack.config.common')

function copyFile (srcPath, destPath) {
  fs.writeFileSync(destPath, fs.readFileSync(srcPath, 'utf8'))
}

if (configCommon.useDllLibraryForProduction) {
  const devtoolsPath = path.join(configCommon.absoluteDevToolsPath, `dll.${configCommon.htmlTemplate}`)
  const buildPath = path.join(configCommon.absoluteBuildPath, configCommon.htmlTemplate)
  if (fs.existsSync(buildPath)) {
    copyFile(
      buildPath,
      devtoolsPath
    )
  } else {
    copyFile(
      devtoolsPath,
      buildPath
    )
  }
}
