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

console.log(`The MVC react component will be generated in the directory ${path.join(configCommon.sourceDir, configCommon.reactComponentsDirectory)}.`)
console.log('You may also specify a path below the target directory above. For example: dir1/dir2/componentname')

rl.question('Name of MVC react component: ', (component) => {
  rl.question('Do you want to generate test files: (Y/N): ', (doTest) => {
    doTest = convertToBoolean(doTest)
    if (!configCommon.useCausalityRedux) {
      rl.close()
      if (generateReact(component, doTest)) {
        console.log(`React Component ${component} generated.`)
      } else {
        console.log(`The component ${component} already exists.`)
      }
      return
    }
    rl.question('Is this a multiple component: (Y/N): ', (isMultiple) => {
      rl.question('Do you want comments: (Y/N): ', (comments) => {
        rl.close()
        if (generateReactMVC(component, doTest, convertToBoolean(isMultiple), convertToBoolean(comments))) {
          console.log(`MVC React Component ${component} generated.`)
        } else {
          console.log(`The component ${component} already exists.`)
        }
      })
    })
  })
})
