const path = require('path');

//
// Configuration
//

// TODO: Go into launch.json and correctly set you program location for mocha in all places in the file. It starts as
// ${workspaceRoot}/node_modules/mocha/bin/_mocha


/*
 This is a list of modules used to create a dll library.
 Important for faster compiling since these rarely change and caching in production.
 However, can produce larger output files in production.
 For debugging, definitely faster. So, use this for debugging and then decide if you want it for production
 by setting useDllLibraryForProduction to true and running builddll. If you add to/subtract from the below, you must run
 npm run builddll
*/
const dllModules = [
  'lodash',
  'react',
  'react-dom',
  'react-router',
  'redux',
  'react-redux',
  'causality-redux',
  'react-causality-redux'
];


// 
// useCSSModules = 0; Do not use css modules for any stylesheets.
// useCSSModules = 1; Use css modules for all stylesheets
// useCSSModules = 2; Do not use css modules for stylesheets in any directory under the source directory 
// named `${No_CSS_Modules_Name}` below. All other stylesheets use css modules.  
//
const useCSSModules = 2;

//
// Indicates the types of stylesheets contained in your project. The possibilities are
// 'css', 'sass' (for either scss or sass) and 'less'. Include all that apply.
// For speed of compilation, exclude those that do not apply. But, if you add any in the future you
// must remember to add the type back in. So, unless compilation is slow, it's best to leave them all in.
//
const stylesheetTypes = ['css', 'sass', 'less'];

//
// The below allows a combination of css modules for some files and not for others. Any that are in a directory
// named below will not have css module ids applied to the css elements. It does not matter
// where this directory is located as long as it is somewhere below the source directory.
// These can be sass and less files also and they will be compiled but no modules applied.
// In order for these non-module files to be included in the css build by webpack, they must be imported in the app.js file like
// See css.js on how this is done.
// Without an import, the css will not be contained in the final minimized css bundle.
//
const noCSSModulesName = 'no_css_modules';

const config = {
  sourceDir: 'src', // Source directory for css, js, jsx, images etc 
  // !!!NOTE!!!, if you change the value below you must also change it in launch.json under the production entry and the url key.
  buildDir: 'dist', // Build directory for script, html file and css.
  dllDir: 'devdll', // Build directory for the the development dll library and index-prod.html template for production based on the production dll library build..
  buildScriptDir: 'scripts', // scripts directory under the build directory to putting the built script file.
  buildCSSDir: 'css', // css directory under the build directory for putting the final compressed css file.
  bundleName: 'bundle', // Bundle name for the build output.
  dllBundleName: 'dllbundle', // Bundle name for the dll library bundle.
  // !!!NOTE!!!, if you change the name of the file below, you must do a builddll and a build.
  htmlOutputFileName: 'index.html', // This is the html file used for your product.
  // !!!NOTE!!!, if you change the contents of this file you must do a complete rebuild of the production and dlls that you use.
  htmlTemplate: 'index.ejs', // html file in the devtools directory to be used for installing scripts and css for the final built product. This is your source.
  htmlDevTemplate: 'index.dev.ejs', // Used for the development html template. This is built.
  resolveExtensions: ['.js', '.jsx', '.sass', '.scss', '.css', '.less'], // Don't have to use these extension for import or require.
  urlLoaderExtensions: ['.png', '.jpeg', '.jpg', '.gif'], // Add extensions if you want to use the url-loader on
  // these assets. Leave it as an empty array if you do not want to use it.
  urlLoaderLimit: 8192, // See url-loader docs. Files will be inlined in the bundle if <= urlLoaderLimit in size. 
  assetsDirectory: 'assets', // If you use the url-loader, webpack will put your asset files in this directory
  // below the production build directory.
  noCSSModulesName,
  useCSSModules,
  stylesheetTypes,
  // Indicates css injections into the source code. Good for react components that require certain styling so
  // that the final user does not have to remember to include your stylesheets.
  // Unless production compilation is slow, it's best to leave them all true or if you add one in the future
  // for any changes which may be hard to remember to do. Note that injections must be css modules.
  // Injected css files must be named as name.inject.css, name.inject.sass, name.inject.scss or name.inject.less
  useLessInjections: true,
  useSassInjections: true,
  useCssInjections: true,
  dllModules,
  useDllLibraryForProduction: true, // Indicates whether the production build should be one js bundle and 
  // one css contained in an html file or whether it should use the dll library method which includes
  // one css, one app js and one dll js. 
  useWatch: false // First do a production build. After that, webpack will watch for changes to source files
  // and rebuild the production code automatically based on those changes. Slows down debugging and you know 
  // if you are ready for a production build. So choose this option wisely. You can always do a manual 
  // build at anytime.
};

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

