# Create-react-cr-project with vscode, perhaps the best environment for developing with react. 
[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com) 

A complete react-causality-redux es6 jsx react project creator for Visual Studio Code originally based on skolmer [react-hot-boilerplate-vscode](https://github.com/skolmer/react-hot-boilerplate-vscode). Also, some of the information below is provided by [skolmer](https://github.com/skolmer/react-hot-boilerplate-vscode).

[Download the React Development Environment.](https://www.npmjs.com/package/create-react-cr-project)

(**Please note, create-react-cr-project is only compatible with node 8.1.3 or higher.**)

## Extensive List Of Features
* **Significantly less coding and debugging than with react alone or with react and redux.**
* Intellisense (code completion) for external libraries via [Automatic Type Acquisition (ATA)](https://code.visualstudio.com/updates/v1_7) 
* Debugging react ES2015 classes inside vscode via [vscode-chrome-debug](https://github.com/Microsoft/vscode-chrome-debug) extension
* Easy access to install, build, test and debugging commands via vscode command palette and keyboard shortcuts
* Supports the javascript standard code styling with eslint.
* JSX code analysis (linting) with autofixing support via [vscode-eslint](https://github.com/Microsoft/vscode-eslint) extension
* Supports typescript.
* Supports the typescript standard code styling with tslint.
* [React Hot Loading](https://www.youtube.com/watch?v=xsSnOQynTHs)
* Hot loading of business logic and demonstrates how it is done for maintainaing the current program state in your business code while debugging.
* Major extensions and simplifications to redux.
* Clean separation between business logic and react components. No entangling program state and business code wiht the UI. Allows react components to be pure UI components. This way when react becomes obsolute, you simply take it out and install a new UI without having to rewrite any program state code or business code.
* The ability to build independent react web components with the react UI part of the component being free of business logic.
* Support for the react router and redux store synchronization with your routes such that any route component will retain its redux store values given route changes and/or browser forward or back movements.
* React loadable support (code splitting).
* React/enzyme auto test environment with vscode debugging.
* Dll library support for debugging for much faster debug compilation.
* Dll library support for production. Users do not have to reload react code for example, each time they visit your site. Ideally, they need only reload your code when it changes.
* Css inline, modules and legacy support. Also support for less, sass, scss and css. Supports the postcss-loader for vendor css prefixes. 
* urlLoader support for your images, fonts etc. Inlines them in the production bundle for faster loading if they are below a threshhold. Also, they can be imported into your react components.
* Minification build bundles for both css and js for production use.
* Allows you to view your production product after a build.
* Supports progressive web apps for production. You can opt out of this.
* Supports material-ui react components.
* Supports development and production proxies so that you can proxy REST requests to your production server or some stub server such as the json-server.

## Visual Studio Code

* [**Download**](https://code.visualstudio.com/)
* [**Tips and Tricks**](https://github.com/Microsoft/vscode-tips-and-tricks)
* [**Supercharge your JavaScript debugging workflow with Visual Studio Code (Build 2017)**](https://channel9.msdn.com/Events/Build/2017/T6071)

### Required Extensions

* [**vscode-chrome-debug**](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
* [**vscode-eslint**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Recommended Extensions

* [ReactSnippets](https://marketplace.visualstudio.com/items?itemName=xabikos.ReactSnippets)
* [vscode-npm](https://marketplace.visualstudio.com/items?itemName=fknop.vscode-npm)
* [npm-intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)

## Installation

1. git clone https://github.com/AndrewBanks10/react-causality-redux-vscode-template or download zip.
2. Go to your command window at the root of causality-redux-react-template and type npm install
3. From the same command window type npm run build:all
4. Open the folder causality-redux-react-template in Visual Studio Code
5. Make sure you have [vscode-chrome-debug](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) and [vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension installed

## Visual Studio Code Shortcuts

* <kbd>F5</kbd> to start debugging
* Set up a keyboard shortcut <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>T</kbd> to display the tasks you can run listed below.
    * Build Production - Builds your production bundles and index.html. 
    * Builddll Development - Builds your development dlls for code like react to speed up debug loading and compilation. 
    * Builddll Development & Production - Builds your development dlls and production dlls.

## Adding React Components
1. In vscode, run the task 'Run Project Configuration'. You may also do it from the command line as npm run config.
2. Click 'CREATE REACT COMPONENT' and the create react component form will be displayed. Type in the component name in the first field and select from the various options and then click 'CREATE COMPONENT' at the top right. Once the component is created click 'EXIT' at the top right and then click the 'EXIT' button at the home screen to properly perform exit cleanup.

## Debugging
* Select the debug button to the left in vscode and select "Debug" from the drop down. Then push the green arrow button next to the dropdown.

## Production Build
* (Outside vscode) - npm run build.
* (Inside vscode) - Display the task list and select "Build Production".

## Run Production Code
* Select the debug button to the left in vscode and select "Production" from the drop down. Then push the green arrow button next to the dropdown. This will run your production code in the browser. (Note: running the production code does not perform a production build.)
 
## React/Enzyme Test Run and Debugging
* (Outside vscode) - npm run test.
* (Inside vscode) - Select the debug button to the left in vscode and select "Run Mocha Tests" from the debug drop down. Then push the green arrow button next to the dropdown.  **Note, set the key "program" in the launch.json file under "Run Mocha Tests" to the location of your mocha program. Currently, it is "program": "${workspaceRoot}/node_modules/mocha/bin/_mocha".**
* For debugging mocha tests, select "Start Debug Mocha Tests" from the debug drop down. This will compile your source code and tests with sourcemaps. Once it is complete, select "Debug Mocha Tests" from the debug drop down. You will be able to set breakpoints in the test code and your source code. Babel is also put into watch mode so if you change a file, that file is recomplied automatically and then just push the debug green arrow button re-run your test again. When you are finished, use the command palette to terminate the babel watch task.   

## License

MIT
