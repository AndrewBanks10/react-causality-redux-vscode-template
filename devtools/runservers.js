/* eslint no-console: 0 */
const childProcess = require('child_process')
const config = require('./webpack.config.config')

process.env.PUBLIC_PATH = config.absoluteBuildPath

console.log('Starting servers')
// Start reading from stdin so we don't exit.
process.stdin.resume()
// Start all the server processes.
for (let i = 2; i < process.argv.length; ++i) {
  childProcess.fork(process.argv[i])
}
setTimeout(
  () => console.log('Servers started'),
  2000
)
