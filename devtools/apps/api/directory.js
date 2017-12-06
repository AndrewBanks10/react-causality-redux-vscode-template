const fs = require('fs')
const path = require('path')
const configCommon = require('../../webpack.config.config')

let listing = []
const generateDirectoryListing = name => {
  if (name !== 'src') {
    listing.push(name)
  }
  let arr = fs.readdirSync(name).filter(e => {
    try {
      return fs.lstatSync(path.join(name, e)).isDirectory()
    } catch (ex) {
      return false
    }
  })
  for (let i = 0; i < arr.length; ++i) {
    generateDirectoryListing(path.join(name, arr[i]))
  }
}

const getSourceDirectoryListing = (req, res) => {
  listing = []
  generateDirectoryListing(configCommon.sourceDir)
  res.send(listing.sort())
}

const makeDirectory = (base, newName) => {
  fs.mkdirSync(path.join(base, newName))
}

const handleMakeDirectory = (req, res) => {
  const config = req.body
  try {
    makeDirectory(config.baseDirectory, config.newDirectoryName)
  } catch (ex) {
  }
  res.send({ success: true })
}

function handleDirectoryRoutes (app) {
  app.get('/directories', getSourceDirectoryListing)
  app.post('/directories', handleMakeDirectory)
}

module.exports = handleDirectoryRoutes
