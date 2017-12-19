const stackTraceLimit = 30
const getStackTrace = () => {
  const err = new Error()
  Error.stackTraceLimit = stackTraceLimit
  Error.captureStackTrace(err)
  const unKnown = 'Unknown'
  let line = 0
  let column = 0
  let moduleName = unKnown
  let isTS = false
  let fullModule = unKnown
  const frames = err.stack.split('\n').slice(1)
  for (let i = 0; i < frames.length; ++i) {
    const index = frames[i].indexOf('at executeSetState')
    if (index !== -1) {
      for (let j = i; j < frames.length; ++j) {
        const search = 'webpack-internal:///'
        let frame = frames[j]
        let nextIndex = frame.indexOf(search)
        if (nextIndex !== -1) {
          try {
            frame = frame.match(/\(([^()]+)\)/)[1]
            const matchArray = frame.match(/(webpack-internal:[^:]*):([0-9]+):([0-9]+)$/)
            fullModule = matchArray[1]
            moduleName = fullModule.match(/webpack-internal:\/\/\/([^]*)$/)[1]
            isTS = moduleName.search(/\.tsx?$/) !== -1
            line = parseInt(matchArray[2])
            column = parseInt(matchArray[3])
          } catch (e) { }
          return {moduleName, line, column, isTS, fullModule, translated: !isTS}
        }
      }
      i = -1
    }
  }
  return {moduleName, line, column, isTS, fullModule, translated: true}
}

export default getStackTrace
