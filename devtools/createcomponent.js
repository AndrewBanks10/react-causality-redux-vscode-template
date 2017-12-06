/* eslint no-console:0 */
const path = require('path')
const readline = require('readline')
const configCommon = require('./webpack.config.config')
const { generateReact, generateReactMVC } = require('./createcomponentbase')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const convertToBoolean = text =>
  text === 'y' ? true : text === 'Y'

function doReadline (prompt) {
  return new Promise(function (resolve) {
    rl.question(`${prompt}: `, answer => {
      resolve(answer)
    })
  })
}

let component
let doTest
let isMultiple
let comments
let reactComponentType
let cssFileType

console.log(`The react component will be generated in the directory ${path.join(configCommon.sourceDir, configCommon.reactComponentsDirectory)}.`)
console.log('You may also specify a path below the target directory above. For example: dir1/dir2/componentname')

function handleRestOfComponent () {
  if (reactComponentType === '0' || reactComponentType === '1') {
    doReadline('Name of react component')
      .then(answer => {
        component = answer
        return doReadline('Do you want to generate test files: (Y/N)')
      })
      .then(answer => {
        doTest = answer
        return doReadline('Is this a multiple component: (Y/N)')
      })
      .then(answer => {
        isMultiple = answer
        return doReadline('Do you want comments: (Y/N)')
      })
      .then(answer => {
        comments = answer
        return doReadline('Css inline file type for component: Enter for none, css, scss, less')
      })
      .then(answer => {
        cssFileType = answer
        rl.close()
        if (generateReactMVC(component, doTest, convertToBoolean(isMultiple), convertToBoolean(comments), reactComponentType, cssFileType)) {
          console.log(`MVC React Component ${component} generated.`)
        } else {
          console.log(`The component ${component} already exists.`)
        }
      })
  } else {
    doReadline('Name of react component')
      .then(answer => {
        component = answer
        return doReadline('Do you want to generate test files: (Y/N)')
      })
      .then(answer => {
        doTest = answer
        return doReadline('Css inline file type for component: Enter for none, css, scss, less')
      })
      .then(answer => {
        cssFileType = answer
        rl.close()
        if (generateReact(component, doTest, reactComponentType, cssFileType)) {
          console.log(`MVC React Component ${component} generated.`)
        } else {
          console.log(`The component ${component} already exists.`)
        }
      })
  }
}

if (configCommon.useCausalityRedux) {
  doReadline('Type of react component: 0-React MVC Stateless Component, 1-React MVC Class Component, 2-React Stateless Component, 3-React Class Component')
    .then(answer => {
      reactComponentType = answer
      handleRestOfComponent()
    })
} else {
  doReadline('Type of react component: 2-React Stateless Component, 3-React Class Component')
    .then(answer => {
      reactComponentType = answer
      handleRestOfComponent()
    })
}
