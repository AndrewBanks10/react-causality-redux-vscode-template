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
import causalityRedux from 'causality-redux'
import { ${makePartitionName(component)} } from './controller'

// The controller functions are in the partition store.
const partitionStore = causalityRedux.store[${makePartitionName(component)}]
const partitionState = partitionStore.partitionState
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

const controllerCode = (component, isMultiple) => {
  let code =
        'import { establishControllerConnections } from \'react-causality-redux\''
  if (isMultiple) {
    code += `
import { ${component} } from './view'`
  } else {
    code += `
import ${component} from './view'`
  }

  code +=
`

/*
  Note: Hot reloading in this controller file only supports changes to the controllerFunctions.
  Any other change requires a refresh.
*/

/*
 TODO: Define the partition store definition
*/
`
  if (configCommon.useTypeScript) {
    code +=
      `interface IPartitionState {
  sampleKey1?: string,
  sampleKey2?: number[]
}

const defaultState: IPartitionState = {
  sampleKey1: '',
  sampleKey2: []
}`
  } else {
    code +=
    `const defaultState = {
  sampleKey1: '',
  sampleKey2: []
}`
  }

  if (configCommon.useTypeScript) {
    code +=
      `

let partitionState: IPartitionState
let setState: any
let wrappedComponents: any`
  } else {
    code +=
    `

let partitionState
let setState
let wrappedComponents`
  }
  code +=
`

/*
 TODO: Define Controller functions which will be made available by causality-redux to the react
 UI component in the props. The fundamental role of a controller function is to set values in the redux
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
`
  if (configCommon.useTypeScript) {
    code +=
      `interface IControllerFunctions {
  sampleFunction1? (url: string): void
  sampleFunction2? (n: number): void
  sampleFunction3? (url: string, arr: number[]): void
}

const controllerFunctions = {
  sampleFunction1: (url: string) => {
    partitionState.sampleKey1 = url
  },
  sampleFunction2: (n: number) => {
    // Note partitionState returns a copy of the value at the key.
    // So, the below must be done to correctly change objects, which are pointers in javascript.
    const arr = partitionState.sampleKey2
    arr.push(n)
    partitionState.sampleKey2 = arr
  },
  sampleFunction3: (url: string, arr: number[]) => {
    // Each assignment by partitionState causes a component render
    // So use the below to change multiple keys with one render.
    setState({ sampleKey1: url, sampleKey2: arr })
  }
}
`
  } else {
    code +=
    `const controllerFunctions = {
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
  }

  if (isMultiple) {
    code +=
          `
/*
  TODO: Add your UI props connections here.
  Each child component of ${component} that requires contoller functions or values in the defaultState above
  needs to be listed in the controllerUIConnections below as an array.
  Entry1 - The component. Must be imported from ../view
  Entry2 - Array of controllerFunctions keys that this component needs provided in the props.
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
    if (configCommon.useTypeScript) {
      code += `export const ${makePartitionName(component)}: string = '${makePartitionName(component)}'`
    } else {
      code += `export const ${makePartitionName(component)} = '${makePartitionName(component)}'`
    }

    code += `

const controllerUIConnections = [
  [${component}, ${makePartitionName(component)}, ['sampleFunction1'], ['sampleKey1'], '${component}']
]

const ret = establishControllerConnections({
  module,
  partition: { partitionName: ${makePartitionName(component)}, defaultState, controllerFunctions },
  controllerUIConnections
});
({ partitionState, setState, wrappedComponents } = ret)
`
  } else {
    code +=
          `
/*
 This establishes all the connections between the UI and defaultState/controllerFunctions.
 It also supports hot reloading for the business logic, UI component and the controller functions.
 By default, all the function keys in controllerFunctions and state keys in defaultState will be made available
 in the props of the connect redux component uiComponent: ${component}.
 To override the function keys, define an array of function key strings at changerKeys in the input object
 to establishControllerConnections.
 To override the defaultState keys, define an array of defaultState key strings at storeKeys in the input object
 to establishControllerConnections.
 */

`
    if (configCommon.useTypeScript) {
      code += `export const ${makePartitionName(component)}: string = '${makePartitionName(component)}'`
    } else {
      code += `export const ${makePartitionName(component)} = '${makePartitionName(component)}'`
    }

    code += `

const ret = establishControllerConnections({
  module, // Needed for hot reloading.
  partition: { partitionName: ${makePartitionName(component)}, defaultState, controllerFunctions },
  uiComponent: ${component}, // Redux connect will be called on this component and returned as uiComponent in the returned object.
  uiComponentName: '${component}' // Used for tracing.
});
({ partitionState, setState, wrappedComponents } = ret)
`
  }

  if (configCommon.useTypeScript) {
    code += `
// Export the redux connect component. Use this in the parent component(s).
export default wrappedComponents.${component} as '${component}'
declare global {namespace JSX {interface IntrinsicElements {'${component}': any}}}
export interface I${component}Props extends IPartitionState, IControllerFunctions { }
`
  } else {
    code += `
// Export the redux connect component. Use this in the parent component(s).
export default wrappedComponents.${component}
`
  }
  return code
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

const controllerCodewc = (component, isMultiple) => {
  let code =
        `import { establishControllerConnections } from 'react-causality-redux'
`
  if (isMultiple) {
    code += `import { ${component} } from './view'`
  } else {
    code += `import ${component} from './view'`
  }

  code += `

// TODO: Define the partition store definition
`
  if (configCommon.useTypeScript) {
    code += `interface IPartitionState {
  sampleKey1?: string
}

const defaultState: IPartitionState = {`
  } else {
    code += `const defaultState = {`
  }
  code += `
  sampleKey1: ''
}
`
  if (configCommon.useTypeScript) {
    code +=
    `
let partitionState: IPartitionState
let wrappedComponents: any
`
  } else {
    code +=
`
let partitionState
let wrappedComponents
`
  }
  code += `
// TODO: Define Controller functions available to the UI.
`
  if (configCommon.useTypeScript) {
    code += `interface IControllerFunctions {
  sampleFunction1? (url: string): void
}

const controllerFunctions: IControllerFunctions = {
  sampleFunction1: (url: string) => {
`
  } else {
    code += `const controllerFunctions = {
  sampleFunction1: (url) => {
`
  }
  code +=
    `    partitionState.sampleKey1 = url
  }
}

`
  if (isMultiple) {
    if (configCommon.useTypeScript) {
      code += `export const ${makePartitionName(component)}: string = '${makePartitionName(component)}'`
    } else {
      code +=
        `export const ${makePartitionName(component)} = '${makePartitionName(component)}'`
    }
    code += `

// TODO: Add your UI props connections here.
const controllerUIConnections = [
  [${component}, ${makePartitionName(component)}, ['sampleFunction1'], ['sampleKey1'], '${component}']
]

const ret = establishControllerConnections({
  module,
  partition: { partitionName: ${makePartitionName(component)}, defaultState, controllerFunctions },
  controllerUIConnections
});
({ partitionState, wrappedComponents } = ret)

`
  } else {
    if (configCommon.useTypeScript) {
      code += `export const ${makePartitionName(component)}: string = '${makePartitionName(component)}'`
    } else {
      code += `export const ${makePartitionName(component)} = '${makePartitionName(component)}'`
    }
    code += `

const ret = establishControllerConnections({
  module,
  partition: { partitionName: ${makePartitionName(component)}, defaultState, controllerFunctions },
  uiComponent: ${component},
  uiComponentName: '${component}'
});
({ partitionState, wrappedComponents } = ret)

`
  }
  if (configCommon.useTypeScript) {
    code += `export default wrappedComponents.${component} as '${component}'
declare global {namespace JSX {interface IntrinsicElements {'${component}': any}}}
export interface I${component}Props extends IPartitionState, IControllerFunctions { }
`
  } else {
    code += `export default wrappedComponents.${component}
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
    code += `import { I${component}Props } from './controller'
`
  } else {
    code += `
`
  }

  if (reactComponentType === '0') {
    if (comments && !configCommon.useTypeScript) {
      code += `// TODO: Add your defaultState keys and controllerFunctions keys from ./controller
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

  let view, controller, model
  if (comments) {
    view = viewCode(component, isMultiple, reactComponentType, cssFileType, comments)
    controller = controllerCode(component, isMultiple)
    model = modelCode(comments)
  } else {
    view = viewCode(component, isMultiple, reactComponentType, cssFileType, comments)
    controller = controllerCodewc(component, isMultiple, cssFileType)
    model = modelCode(comments)
  }

  if (cssFileType !== '') {
    fs.writeFileSync(path.join(dir, cssFileName(cssFileType)), '')
  }

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
