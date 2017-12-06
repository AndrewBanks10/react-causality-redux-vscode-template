const { generateReactComponent } = require('./createcomponentbase')

generateReactComponent(
  process.argv[2], // defaultDirectory
  process.argv[3] === 'true', // useCausalityRedux
  process.argv[4], // componentName
  process.argv[5] === 'true', // generateTestFiles
  process.argv[6] === 'true', // useMultiComponent
  process.argv[7] === 'true', // useComments
  process.argv[8], // reactComponentType
  process.argv[9] // cssFileType
)
