const path = require('path')
const fs = require('fs')
const configCommon = require('./webpack.config.common')

if (configCommon.useDllLibraryForProduction) {
  const buildPath = path.join(configCommon.absoluteBuildPath, configCommon.htmlTemplate)
  fs.unlinkSync(buildPath)
}
