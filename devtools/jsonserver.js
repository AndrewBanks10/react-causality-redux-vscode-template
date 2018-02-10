/* eslint no-console: 0 */
const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require('path')

let port = 3002
if (typeof process.argv[2] !== 'undefined') {
  port = parseInt(process.argv[2])
}

let db = path.join('data', 'db.json')
if (typeof process.argv[3] !== 'undefined') {
  db = process.argv[3]
}

const router = jsonServer.router(db)
const middlewares = jsonServer.defaults()
server.use(middlewares)
server.use(router)

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}, db=${db}`)
})
