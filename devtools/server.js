/* eslint no-console: 0 */
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

let config
if (process.env.NODE_ENV === 'development') {
  config = require('./webpack.config.dev')
} else {
  config = require('./webpack.config.prod')
}

const port = process.env.npm_package_config_port || 3000
const host = process.env.npm_package_config_host || 'localhost'

new WebpackDevServer(webpack(config), config.devServer
).listen(port, host, function (err) {
  if (err) {
    console.log(err)
  }
  console.log(`devtools/server.js listening at http://${host}:${port}.`)
})
