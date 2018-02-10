/* eslint no-console: 0 */
const app = require('express')()

//
// These are put into the port and host fields in the configuration program under
// production or development.
//
const port = 3011
const host = 'localhost'

//
// cors, required for proxy
//
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '"Origin, X-Requested-With, Content-Type, Accept')
  next()
})

//
// Handle the endpoints that you put into endpoints in the configuration program.
// So /proxy was the only endpoint listed in the configuration program.
//
app.get('/proxy', function (req, res) {
  res.send({ success: true, proxy: '/proxy' })
})

try {
  app.listen(port, host, function () {
    console.log(`devtools/proxy.js listening at http://${host}:${port}.`)
  })
} catch (ex) {
  console.log(`Server error ${ex}.`)
}
