const path = require('path')
const fs = require('fs')
const configCommon = require('./webpack.config.config')

function mkdir (directory) {
  try {
    fs.mkdirSync(directory)
  } catch (ex) {
  }
}

const codeFileName = templateName =>
  configCommon.useTypeScript ? `${templateName}.ts` : `${templateName}.js`

const reactFileName = templateName =>
  configCommon.useTypeScript ? `${templateName}.tsx` : `${templateName}.jsx`

const cssFileName = cssFileType =>
  (`view.inject.${cssFileType}`)

const makePartitionName = (component) =>
  `${component.charAt(0).toLowerCase()}${component.slice(1)}Partition`

const modelTestFileCode = (component) => {
  let code =
    `import assert from 'assert'

`
  if (configCommon.useTypeScript) {
    code =
    `import * as assert from 'assert'

`
  }
  code +=
`describe('Model ${component}', function () {
  // TODO: Add model test code.
  it('Sample - validated.', function () {
    assert(true)
  })
})
`
  return code
}

const controllerTestFileCode = (component) => {
  let code =
  `import assert from 'assert'

`
  if (configCommon.useTypeScript) {
    code =
    `import * as assert from 'assert'

`
  }
  code +=
`/*
import { partitionStore, partitionState } from './'
*/

describe('Controller ${component}', function () {
  // TODO: Add controller test code.
  it('Sample - validated.', function () {
    assert(true)
  })
})
`
  return code
}

const viewTestCode = (dir, component) => {
  let importPath = ''
  const c = dir.split(path.sep)
  for (let i = 0; i < c.length; ++i) {
    importPath += '../'
  }
  importPath += 'test/projectsetup'
  let code =
  `import assert from 'assert'

`
  if (configCommon.useTypeScript) {
    code =
    `import * as assert from 'assert'

`
  }
  code +=
`// Use what you need below. There are others also.
// import { testCauseAndEffectWithExists, testCauseAndEffectWithNotExists, testCauseAndEffectWithHtmlString, testCauseAndEffectWithTextField } from '${importPath}'

describe('View ${component}', function () {
  // TODO: Add view test code.
  it('Sample - validated.', function () {
    assert(true)
  })
})
`
  return code
}

const codeTestCode = (dir, component) => {
  let code =
  `import assert from 'assert'

`
  if (configCommon.useTypeScript) {
    code =
    `import * as assert from 'assert'

`
  }
  code +=
`describe('Test ${component}', function () {
  // TODO: Add test code.
  it('Sample - validated.', function () {
    assert(true)
  })
})
`
  return code
}

const handleTestFiles = (dir, component, doTest) => {
  if (!doTest) {
    return
  }
  fs.writeFileSync(path.join(dir, codeFileName('controller.spec')), controllerTestFileCode(component))
  fs.writeFileSync(path.join(dir, codeFileName('view.spec')), viewTestCode(dir, component))
  fs.writeFileSync(path.join(dir, codeFileName('model.spec')), modelTestFileCode(component))
}

const establishControllerConnectionsComments = (component, comments) => {
  if (!comments) {
    return ''
  }
  return (
    `/*
This establishes all the connections between the UI and defaultState/uiServiceFunctions.
It also supports hot reloading for the business logic, UI component and the controller functions.
By default, all the function keys in uiServiceFunctions and state keys in defaultState will be made available
in the props of the connect redux component uiComponent: ${component}.
To override the function keys, define an array of function key strings at changerKeys in the input object
to establishControllerConnections.
To override the defaultState keys, define an array of defaultState key strings at storeKeys in the input object
to establishControllerConnections.
*/
`
  )
}

const multipleComponentComments = (component, comments) => {
  if (!comments) {
    return `// TODO: Add your UI props connections here.
`
  }
  return (
    `/*
  TODO: Add your UI props connections here.
  Each child component of ${component} that requires uiServiceFunctions or values in the defaultState above
  needs to be listed in the controllerUIConnections below as an array.
  Entry1 - The component. Must be imported from ../view
  Entry2 - Array of uiServiceFunctions keys that this component needs provided in the props.
  Entry3 - Array of defaultState keys (store keys) that this component needs provided in the props.
  Entry4 - String name of the component.

  CausalityRedux automatically adds any component name(key)/component listed in controllerUIConnections
  to the component's store partition. This way, you can access the redux connected component in the props.

  Any component listed below that is required by another component must be listed in the parent component's
  store keys. Then the parent must include that component's name in the props.
  Example:

const controllerUIConnections = [
  [Child, ['sampleFunction2'], ['sampleKey2'], 'Child'],
  [Parent, ['sampleFunction1'], ['sampleKey1', 'Child'], 'Parent']
]

in view.jsx or view.tsx

const Child = ({sampleFunction2, sampleKey2}) =>
  <div/>

// Note that Child is included in Parent in controllerUIConnections in the store keys.
// Then causalityRedux creates a partition store entry that contains the enhanced redux connected Child component.
// You then use that as a component in the Parent react definition.

// Child below is not the Child defined above but is the redux connected component.
const Parent = ({ sampleFunction1, sampleKey1, Child }) =>
  <Child/>
*/
`
  )
}

const controllerIndexJS = (component, isMultiple, comments) => {
  let code = `import { establishControllerConnections } from 'react-causality-redux'`
  if (isMultiple) {
    code += `
import { ${component} } from './view'`
  } else {
    code += `
import ${component} from './view'`
  }

  code += `
import { defaultState, uiServiceFunctions } from './controller'

const ${makePartitionName(component)} = '${makePartitionName(component)}'

`
  if (isMultiple) {
    code += `// TODO: Add your UI props connections here.
const controllerUIConnections = [
  [${component}, ${makePartitionName(component)}, ['sampleFunction1'], ['sampleKey1'], '${component}']
]

`
    code += establishControllerConnectionsComments(component, comments)
    code += `const { partitionStore, partitionState, setState, getState, subscribe, wrappedComponents } = establishControllerConnections({
  module,
  partition: { partitionName: ${makePartitionName(component)}, defaultState, uiServiceFunctions },
  controllerUIConnections
})`
  } else {
    code += establishControllerConnectionsComments(component, comments)
    code += `const { partitionStore, partitionState, setState, getState, subscribe, wrappedComponents } = establishControllerConnections({
  module,
  partition: { partitionName: ${makePartitionName(component)}, defaultState, uiServiceFunctions },
  uiComponent: ${component},
  uiComponentName: '${component}'
})`
  }
  code += `

export { ${makePartitionName(component)}, partitionStore, partitionState, setState, getState, subscribe }
export default wrappedComponents.${component}
`
  return code
}

const controllerIndexTS = (component, isMultiple, comments) => {
  let code = `import { establishControllerConnections } from 'react-causality-redux'`
  if (isMultiple) {
    code += `
import { ${component} } from './view'`
  } else {
    code += `
import ${component} from './view'`
  }
  code += `
import { IPartitionState, defaultState, IUIServiceFunctions, uiServiceFunctions } from './controller'

const ${makePartitionName(component)}: string = '${makePartitionName(component)}'

`
  if (isMultiple) {
    code += multipleComponentComments(component, comments)

    code += `const controllerUIConnections = [
  [${component}, ${makePartitionName(component)}, ['sampleFunction1'], ['sampleKey1'], '${component}']
]

let partitionState: IPartitionState
let partitionStore: any
let setState: any
let getState: any
let subscribe: any
let wrappedComponents: any
({ partitionStore, partitionState, setState, getState, subscribe, wrappedComponents } = establishControllerConnections({
  module,
  partition: { partitionName: ${makePartitionName(component)}, defaultState, uiServiceFunctions },
  controllerUIConnections
}))`
  } else {
    code += `let partitionState: IPartitionState
let partitionStore: any
let setState: any
let getState: any
let subscribe: any
let wrappedComponents: any
({ partitionStore, partitionState, setState, getState, subscribe, wrappedComponents } = establishControllerConnections({
  module,
  partition: { partitionName: ${makePartitionName(component)}, defaultState, uiServiceFunctions },
  uiComponent: ${component},
  uiComponentName: '${component}'
}))`
  }
  code += `

export { ${makePartitionName(component)}, partitionStore, partitionState, setState, getState, subscribe }
export default wrappedComponents.${component} as '${component}'
declare global {namespace JSX {interface IntrinsicElements {'${component}': any}}}
export interface I${component}Props extends IPartitionState, IUIServiceFunctions { }
`
  return code
}

const controllerIndex = (component, isMultiple, comments) => {
  if (configCommon.useTypeScript) {
    return controllerIndexTS(component, isMultiple, comments)
  }
  return controllerIndexJS(component, isMultiple, comments)
}

const controllerCodeJS = () => {
  return (`import { partitionState } from './'

// TODO: Define the partition store definition
export const defaultState = {
  sampleKey1: ''
}

// TODO: Define service functions available to the UI.
export const uiServiceFunctions = {
  sampleFunction1: (url) => {
    partitionState.sampleKey1 = url
  }
}
`
  )
}

const controllerCodeJSWithComments = () => {
  return (`import { partitionState, setState } from './'

// TODO: Define the partition store definition
export const defaultState = {
  sampleKey1: '',
  sampleKey2: []
}

/*
  Define controller service functions for external events here and export them.
  Then import them into ./index and also export them there so that other parts
  of your program can import them from the ./index file. Although you can export them
  as individual functions, you can also use a controller object as below. This
  makes it easier to maintain the code since all external service functions
  are contained in one controller object.

export const externalServiceFunctions {
}
*/

/*
 TODO: Define UI service functions which will be made available by causality-redux to the react
 UI component in the props. The fundamental role of a UI service function is to set values in the redux
 partition defaultState. This may be done based on changes from the UI or may also be done as
 a result of a call to a synchronous or asynchronous operation in the business code (model.js or model.ts).
 Based on changes in defaultState, causality-redux will re-render the react component with these
 new values set correctly in the props so that the react UI is updated correctly.

 Use partitionState to access the keys of default state in these functions.
 partitionState is a proxy that returns a copy of the value at the selected key.
 Example:
 let value = partitionState.key;

 To set a key do partitionState.key = value;
 use setState to set multiple keys simultaenously like setState({sampleKey1: val1, sampleKey2: val2});
 Using partitionState to set multiple keys will cause multiple renders of the react component(s).
*/
export const uiServiceFunctions = {
  sampleFunction1: (url) => {
    partitionState.sampleKey1 = url
  },
  sampleFunction2: (e) => {
    // Note partitionState returns a copy of the value at the key.
    // So, the below must be done to correctly change objects, which are pointers in javascript.
    const arr = partitionState.sampleKey2
    arr.push(e)
    partitionState.sampleKey2 = arr
  },
  sampleFunction3: (url, arr) => {
    // Each assignment by partitionState causes a component render
    // So use the below to change multiple keys with one render.
    setState({ sampleKey1: url, sampleKey2: arr })
  }
}
`
  )
}

const controllerCodeTS = () => {
  return (`import { partitionState } from './'

// TODO: Define the partition store definition
export interface IPartitionState {
  sampleKey1?: string
}

export const defaultState: IPartitionState = {
  sampleKey1: ''
}

// TODO: Define Controller functions available to the UI.
export interface IUIServiceFunctions {
  sampleFunction1? (url: string): void
}

export const uiServiceFunctions: IUIServiceFunctions = {
  sampleFunction1: (url: string) => {
    partitionState.sampleKey1 = url
  }
}
`
  )
}

const controllerCodeTSWithComments = () => {
  return (`import { partitionState, setState } from './'

// TODO: Define the partition store definition
export interface IPartitionState {
  sampleKey1?: string,
  sampleKey2?: number[]
}

export const defaultState: IPartitionState = {
  sampleKey1: '',
  sampleKey2: []
}

/*
  Define controller service functions for external events here and export them.
  Then import them into ./index and also export them there so that other parts
  of your program can import them from the ./index file. Although you can export them
  as individual functions, you can also use a controller object as below. This
  makes it easier to maintain the code since all external service functions
  are contained in one controller object.

export const externalServiceFunctions {
}
*/

/*
 TODO: Define UI service functions which will be made available by causality-redux to the react
 UI component in the props. The fundamental role of a UI service function is to set values in the redux
 partition defaultState. This may be done based on changes from the UI or may also be done as
 a result of a call to a synchronous or asynchronous operation in the business code (model.js or model.ts).
 Based on changes in defaultState, causality-redux will re-render the react component with these
 new values set correctly in the props so that the react UI is updated correctly.

 Use partitionState to access the keys of default state in these functions.
 partitionState is a proxy that returns a copy of the value at the selected key.
 Example:
 let value = partitionState.key;

 To set a key do partitionState.key = value;
 use setState to set multiple keys simultaenously like setState({sampleKey1: val1, sampleKey2: val2});
 Using partitionState to set multiple keys will cause multiple renders of the react component(s).
*/
export interface IUIServiceFunctions {
  sampleFunction1? (url: string): void,
  sampleFunction2? (e: number): void,
  sampleFunction3? (url: string, arr: number[]): void
}

export const uiServiceFunctions: IUIServiceFunctions = {
  sampleFunction1: (url: string) => {
    partitionState.sampleKey1 = url
  },
  sampleFunction2: (e: number) => {
    // Note partitionState returns a copy of the value at the key.
    // So, the below must be done to correctly change objects, which are pointers in javascript.
    const arr = partitionState.sampleKey2
    arr.push(e)
    partitionState.sampleKey2 = arr
  },
  sampleFunction3: (url: string, arr: number[]) => {
    // Each assignment by partitionState causes a component render
    // So use the below to change multiple keys with one render.
    setState({ sampleKey1: url, sampleKey2: arr })
  }
}
`
  )
}

const modelCode = (comments) => {
  let code = ''
  if (comments) {
    code += `/*
  Ideally, the business code would consist only of pure functions. However, there are cases (such as a cache)
  where business code data is needed.
  To support hot reloading, use the below for business data.
  This will create a unique redux partition for this business data in order to support hot reloading
  in this business code.

  let nonUIData = {
    whateveryouneed: [];
    numberType: 0;
  }
  const moduleData = causalityRedux.getModuleData(process.env.NODE_ENV !== 'production', nonUIData).moduleData;

  Then moduleData is a proxy to the redux store partitiondata.
  So, moduleData.whateveryouneed returns a copy to the data. Then to change whateveryouneed do
  let arr = moduleData.whateveryouneed;
  arr.push('1');
  moduleData.whateveryouneed = arr;

  For javascript basic data types, simply do the below.
  moduleData.numberType = 1;
  or you can do
  ++moduleData.numberType;

  TODO: Add your business functions
*/
`
  } else {
    code += `//  TODO: Add your business functions
`
  }

  return code
}

const viewCode = (component, isMultiple, reactComponentType, cssFileType, comments) => {
  let code = ''
  if (configCommon.useTypeScript) {
    code += `import * as React from 'react'
`
  } else {
    code += `import React from 'react'
`
  }

  if (cssFileType !== '') {
    code += `import './view.inject'
`
  }

  if (configCommon.useTypeScript) {
    code += `import { I${component}Props } from './'
`
  } else {
    code += `
`
  }

  if (reactComponentType === '0') {
    if (comments && !configCommon.useTypeScript) {
      code += `// TODO: Add your defaultState keys and uiServiceFunctions keys from ./controller
// as shown below.

`
    }

    if (!configCommon.useTypeScript) {
      if (isMultiple) {
        code += 'export '
      }
      code +=
        `const ${component} = (/* { sampleKey1, sampleFunction1 } */) =>
`
    } else {
      code +=
        `
`
      if (isMultiple) {
        code += 'export '
      }
      code +=
`const ${component}: React.StatelessComponent<I${component}Props> = (/* { sampleKey1, sampleFunction1 } */) =>
`
    }
    code +=
`  <div>
    TODO: Define your component.
  </div>
`
  } else {
    if (configCommon.useTypeScript) {
      code += `
`
      if (isMultiple) {
        code += 'export '
      }
      code +=
`class ${component} extends React.Component<I${component}Props> {
  constructor (props: I${component}Props) {
`
    } else {
      if (isMultiple) {
        code += 'export '
      }
      code += `class ${component} extends React.Component {
  constructor (props) {
`
    }
    code +=
`    super(props)
    this.state = {
    }
  }
  render () {
    return (
      <div>
        TODO: Define your component.
      </div>
    )
  }
}
`
  }
  if (!isMultiple) {
    code += `
export default ${component}
`
  }
  return code
}

const viewCodeReact = (component, reactComponentType, cssFileType) => {
  let code = ''
  if (configCommon.useTypeScript) {
    code += `import * as React from 'react'
`
  } else {
    code += `import React from 'react'
`
  }
  if (cssFileType !== '') {
    code += `import '${component}.inject'
`
  }
  if (reactComponentType === '3') {
    if (configCommon.useTypeScript) {
      code += `
interface Props extends React.Props<${component}> {
}

export default class ${component} extends React.Component<Props> {`
    } else {
      code += `
export default class ${component} extends React.Component {`
    }
    code += `
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
    return (
      <div>
        TODO: Define your component.
      </div>
    )
  }
}
`
  } else {
    if (configCommon.useTypeScript) {
      code += `
interface Props {
}

const ${component}: React.StatelessComponent<Props> = (props) =>`
    } else {
      code += `
const ${component} = (props) =>`
    }

    code +=
`
  <div>
    TODO: Define your component.
  </div>
`
    code += `
export default ${component}
`
  }

  return code
}

const makeComponentDirectories = (component, noCR, isUI) => {
  let dir = ''

  if (!isUI) {
    dir = path.join(configCommon.sourceDir, configCommon.reactComponentsDirectory)
  }
  const arr = component.split('/')
  let len = arr.length
  if (noCR) {
    --len
  }
  for (let i = 0; i < len; ++i) {
    dir = path.join(dir, arr[i])
    mkdir(dir)
  }
  return { dir, component: arr[arr.length - 1] }
}

const generateCodeFile = (component, doTest, isUI) => {
  const ret = makeComponentDirectories(component, true, isUI)
  const dir = ret.dir
  component = ret.component

  const filePath = path.join(dir, codeFileName(component))

  if (fs.existsSync(filePath)) {
    return false
  }

  fs.writeFileSync(filePath, `// TODO: Add code
`)

  if (doTest) {
    fs.writeFileSync(path.join(dir, codeFileName(`${component}.spec`)), codeTestCode(dir, component))
  }
  return true
}

const generateReact = (component, doTest, reactComponentType, cssFileType, isUI) => {
  const ret = makeComponentDirectories(component, true, isUI)
  const dir = ret.dir
  component = ret.component

  const filePath = path.join(dir, reactFileName(component))

  if (fs.existsSync(filePath)) {
    return false
  }

  fs.writeFileSync(filePath, viewCodeReact(component, reactComponentType, cssFileType))

  if (cssFileType !== '') {
    fs.writeFileSync(path.join(dir, `${component}.inject.${cssFileType}`), '')
  }

  if (doTest) {
    fs.writeFileSync(path.join(dir, codeFileName(`${component}.spec`)), viewTestCode(dir, component))
  }
  return true
}

const generateReactMVC = (component, doTest, isMultiple, comments, reactComponentType, cssFileType, isUI) => {
  const ret = makeComponentDirectories(component, false, isUI)
  const dir = ret.dir

  const viewName = reactFileName('view')

  if (fs.existsSync(path.join(dir, viewName))) {
    return false
  }

  component = ret.component

  const model = modelCode(comments)
  const view = viewCode(component, isMultiple, reactComponentType, cssFileType, comments)
  const indexCode = controllerIndex(component, isMultiple, comments)
  let controller
  if (comments) {
    if (configCommon.useTypeScript) {
      controller = controllerCodeTSWithComments()
    } else {
      controller = controllerCodeJSWithComments()
    }
  } else {
    if (configCommon.useTypeScript) {
      controller = controllerCodeTS()
    } else {
      controller = controllerCodeJS()
    }
  }

  if (cssFileType !== '') {
    fs.writeFileSync(path.join(dir, cssFileName(cssFileType)), '')
  }

  fs.writeFileSync(path.join(dir, codeFileName('index')), indexCode)
  fs.writeFileSync(path.join(dir, codeFileName('controller')), controller)
  fs.writeFileSync(path.join(dir, viewName), view)
  fs.writeFileSync(path.join(dir, codeFileName('model')), model)
  handleTestFiles(dir, component, doTest)
  return true
}

const generateReactComponent = (defaultDirectory, useCausalityRedux, component, doTest, isMultiple, comments, reactComponentType, cssFileType) => {
  const dir = `${defaultDirectory}/${component}`
  let ret
  if (reactComponentType === '0' || reactComponentType === '1') {
    ret = generateReactMVC(dir, doTest, isMultiple, comments, reactComponentType, cssFileType, true)
  } else if (reactComponentType === '4') {
    ret = generateCodeFile(dir, doTest, true)
  } else {
    ret = generateReact(dir, doTest, reactComponentType, cssFileType, true)
  }
  if (ret) {
    process.exit(0)
  }
  process.exit(1)
}

module.exports = { generateReactMVC, generateReact, generateReactComponent }
