const path = require('path');
const projectConfig = require('./projectconfig');
const projectDllModules = require('./projectdllmodules');

const config = Object.assign({}, projectConfig);
config.dllModules = config.dllModules.concat(projectDllModules);

config.basePath = process.cwd();

// At this time, the source directory must be directly below the vscode directory.
config.absoluteSourcePath = path.join(config.basePath, config.sourceDir);

// At this time, you must have your node_modules directory in or above the vscode directory.
// The setting below makes that assumption.
config.node_modulesPath = 'node_modules';

// At this time, the build directory must be directly below the vscode directory.
config.absoluteBuildPath = path.join(config.basePath, config.buildDir);
config.absoluteBuildScriptsPath = path.join(config.absoluteBuildPath, config.buildScriptDir);
config.absoluteDevToolsPath = path.join(config.basePath, 'devtools');

// At this time, the dll directory must be directly below the vscode directory.
config.absoluteDllPath = path.join(config.basePath, config.dllDir);

// Set the program entry point of your development/debug environents
if (process.env.NODE_ENV === 'production')
  config.entryJs = 'index.js';
else 
  config.entryJs = 'index.dev.js';  

module.exports = config;

