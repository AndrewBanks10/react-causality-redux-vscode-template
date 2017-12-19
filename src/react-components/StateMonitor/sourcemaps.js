/* eslint no-console: 0 */
import { SourceMapConsumer } from 'source-map'
import causalityRedux from 'causality-redux'

const isTypescript = causalityRedux.globalStore.partitionState.isTypescript
// Set this to false if chrome fixes their line number translation error for typescript.
const doTSSourceMaps = true

let sourcemapsValid = false

const loadedScripts = {}
const loadedSourceMaps = {}
let currentScriptIndex = 0
let scriptUrls = []

export function mapModule (frameModule) {
  // If the source maps are not valid do not translate yet.
  // Once they become valid, translation will occur.
  if (!sourcemapsValid || !doTSSourceMaps) {
    return frameModule
  }
  try {
    const fm = loadedSourceMaps[frameModule.fullModule].originalPositionFor(frameModule)
    frameModule.line = fm.line
    frameModule.column = fm.column
  } catch (ex) { }
  frameModule.translated = true
  return frameModule
}

function sourceMaps (file) {
  let startSearch2 = '//# '
  startSearch2 += 'sourceMappingURL'
  let startSearch1 = '//# '
  startSearch1 += 'sourceURL='
  const endSearch = '\\n//# sourceURL='
  let start = 0
  while (true) {
    start = file.indexOf(startSearch1, start)
    if (start !== -1) {
      start = file.indexOf(startSearch2, start)
    }
    if (start === -1) {
      break
    } else {
      start += startSearch2.length
      let end = file.indexOf(endSearch, start)
      const contents = file.slice(start, end)
      start = contents.indexOf(',') + 1
      const b64Encoded = contents.slice(start)
      let decoded = Buffer.from(b64Encoded, 'base64').toString()
      let map
      try {
        map = new SourceMapConsumer(JSON.parse(decoded))
      } catch (ex) {
        console.log(`ERROR ${b64Encoded.length}, ex=${ex}`)
      }
      start = end + endSearch.length
      let sourceUrl = ''
      while (file.charAt(start) !== '\\') {
        sourceUrl += file.charAt(start)
        ++start
      }
      loadedSourceMaps[sourceUrl] = map
    }
  }
}

function loadNextScript (completionHandler) {
  // Done
  if (currentScriptIndex === scriptUrls.length) {
    sourcemapsValid = true
    completionHandler()
    return
  }
  const url = scriptUrls[currentScriptIndex++]
  // Script already loaded. Move to the next one.
  if (loadedScripts[url]) {
    loadNextScript(completionHandler)
    return
  }
  const req = new XMLHttpRequest()
  req.onload = function () {
    loadedScripts[url] = true
    sourceMaps(req.responseText)
    loadNextScript(completionHandler)
  }
  req.open('GET', url)
  req.send()
}

export function loadSourceMaps (completionHandler) {
  // Source maps on stack traces only fail with typescript and not JS.
  if (!isTypescript || !doTSSourceMaps) {
    completionHandler()
    return
  }
  sourcemapsValid = false
  currentScriptIndex = 0
  scriptUrls = []
  const elements = document.getElementsByTagName('script')
  for (let i = 0; i < elements.length; ++i) {
    scriptUrls.push(elements[i].src)
  }
  loadNextScript(completionHandler)
}

if (module.hot) {
  module.hot.decline()
}
