# React-causality-redux with vscode, perhaps the best environment for developing with react.
[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com) 

A complete react-causality-redux es6 jsx boilerplate project for Visual Studio Code based on skolmer [react-hot-boilerplate-vscode](https://github.com/skolmer/react-hot-boilerplate-vscode). Also, some of information below is provided by [skolmer](https://github.com/skolmer/react-hot-boilerplate-vscode).

(**Please note, this template includes the most advanced technologies and is only compatible with node 8.1.3 or higher.**)

## Extensive List Of Features
* **Significantly less coding and debugging than with react alone or with react and redux.**
* Intellisense (code completion) for external libraries via [Automatic Type Acquisition (ATA)](https://code.visualstudio.com/updates/v1_7) 
* Debugging react ES2015 classes inside vscode via [vscode-chrome-debug](https://github.com/Microsoft/vscode-chrome-debug) extension
* Easy access to install, build, test and debugging commands via vscode command palette and keyboard shortcuts
* JSX code analysis (linting) with autofixing support via [vscode-eslint](https://github.com/Microsoft/vscode-eslint) extension
* [React Hot Loading](https://www.youtube.com/watch?v=xsSnOQynTHs)
* Hot loading of business logic and demonstrates how it is done for maintainaing the current program state in your business code while debugging.
* Supports standard javascript code style with eslint. 
* Major extensions and simplifications to redux.
* Clean separation between business logic and react components. No entangling program state and business code wiht the UI. Allows react components to be pure UI components. This way when react becomes obsolute, you simply take it out and install a new UI without having to rewrite any program state code or business code.
* The ability to build independent react web components with the react UI part of the component being free of business logic.
* Support for the react router and redux store synchronization with your routes such that any route component
will retain its redux store values given route changes and/or browser forward or back movements.
* React/enzyme auto test environment with vscode debugging.
* Dll library support for debugging for much faster debug compilation.
* Dll library support for production. Users do not have to reload react code for example, each time they visit your site. Ideally, they need only reload your code when it changes.
* Css inline, modules and legacy support. Also support for less, sass, scss and css. Supports the postcss-loader for vendor css prefixes. 
* urlLoader support for your images, fonts etc. Inlines them in the production bundle for faster loading if they are below a threshhold. Also, they can be imported into your react components.
* Minification build bundles for both css and js for production use.
* Allows you to view your production product after a build.
* The project contains css, jsx and js code that demonstrates how to use all features provided by the template.

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

1. `git clone https://github.com/AndrewBanks10/react-causality-redux-vscode-template` or download zip.
2. Go to your command window at the root of causality-redux-react-template and type npm install
3. From the same command window type npm run build:all
4. Open the folder causality-redux-react-template in Visual Studio Code
5. Make sure you have [vscode-chrome-debug](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) and [vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension installed
6. Open the file devtools/webpack.config.config.js and follow the instructions at the beginning.

## Visual Studio Code Shortcuts

* <kbd>F5</kbd> to start debugging
* Set up a keyboard shortcut <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>T</kbd> to display the tasks you can run listed below.
    * Build Production - Builds your production bundles and index.html. 
    * Builddll Development - Builds your development dlls for code like react to speed up debug loading and compilation. 
    * Builddll Development & Production - Builds your development dlls and production dlls.

## Debugging
* Select the debug button to the left in vscode and select "Debug" from the drop down. Then push the green arrow button next to the dropdown.

## Production Build
* (Outside vscode) - npm run build.
* (Inside vscode) - Display the task list and select "Build Production".

## Run Production Code
* Select the debug button to the left in vscode and select "Production" from the drop down. Then push the green arrow button next to the dropdown. This will run your production code in the browser. (Note: running the production code does not perform a production build.)
 
## Build Dlls
Each time your imported modules change like react, a builddll must be performed.
* Build development dlls - Use this if you do not use dlls in your production build.
    * (Outside vscode) - npm run builddll:dev.
    *  - See the keyboard shortcuts for building inside vscode.
* Build development & production dlls - Use this if you use dlls in your production build.
    * (Outside vscode) - npm run builddll.
    * (Inside vscode) - See the keybaord shortcuts for building inside vscode.

## React/Enzyme Test Run and Debugging
* (Outside vscode) - npm run test.
* (Inside vscode) - Select the debug button to the left in vscode and select "Run Mocha Tests" from the debug drop down. Then push the green arrow button next to the dropdown.  **Note, set the key "program" in the launch.json file under "Run Mocha Tests" to the location of your mocha program. Currently, it is "program": "${workspaceRoot}/node_modules/mocha/bin/_mocha".**
* For debugging mocha tests, select "Start Debug Mocha Tests" from the debug drop down. This will compile your source code and tests with sourcemaps. Once it is complete, select "Debug Mocha Tests" from the debug drop down. You will be able to set breakpoints in the test code and your source code. Babel is also put into watch mode so if you change a file, that file is recomplied automatically and then just push the debug green arrow button re-run your test again. When you are finished, use the command palette to terminate the babel watch task.   

## Template Configuration
All configuration settings are in the file devtools/webpack.config.config.js and are well documented. However, below is a few important notes.
* You must decide whether to use dlls in your production build. If so, a Builddll Development & Production listed above in keyboard shortcuts must be performed.
* If you update your import modules you must also do a builddll for development and/or production.

## License

MIT

### How can you hot reload your business code for easy debugging and also keep it completely separate from the UI code so that future UI platform changes are easy to adjust to? Use causality-redux.

Causality-redux is an extension to redux that significantly reduces redux and react-redux coding and debugging.

To show how easy causality-redux is to use, consider the example below.

```
import React from 'react';
import CausalityRedux from 'causality-redux';

// First define the store partition as below.
const COUNTER_STATE = 'COUNTER_STATE';
const reduxCounter = {
    partitionName: COUNTER_STATE,
    defaultState: { counter: 0 } // This is the state object for the COUNTER_STATE partition.
}
CausalityRedux.createStore([reduxCounter]); // Create the causality-redux store and use the store partition above for definitions.
const counterState = CausalityRedux.store[COUNTER_STATE].partitionState;

// To connect this to a react component, here is an example.
const CounterForm = ({counter}) => 
    <div>
        <div>{`The current counter is ${counter}.`}</div>
        <button onClick={() => counterState.counter++}>Up</button> // Causes a detectable state change to counter in the redux store.
        <button onClick={() => counterState.counter--}>Down</button> // Causes a detectable state change to counter in the redux store.
    </div>
// Now wrap the component CounterForm
const CounterFormCausalityRedux = CausalityRedux.connectStateToProps(
    CounterForm, // React component to wrap.
    COUNTER_STATE, // State partition
    ['counter'] // This is an array of values in COUNTER_STATE that you want passed into the props. Whenever counter 
                // changes in the redux store, this component will render with the new value of counter set in the props.
);

const App = () =>
    <Provider store={ CausalityRedux.store}>
        <CounterFormCausalityRedux/>
    </Provider>
```

That is all there is to it. Note that there are no changers, reducers, dispatching, redux connects or mapStateToProps/mapDispatchToProps definitions.
The buttons are clicked, the counter value is changed in the redux store then CounterForm is rendered with the new value of counter that is set in the props. So, the new value is shown to the user.


## Benefits of causality-redux
- You can define multiple partitions within the redux store. This way, one partition can be associated exclusively with a causality chain of a UI component and its business logic. This also allows you to have shared partitions that can be used to change the state of such things as a UI busy loader than can be shared by different causality chains.
- By assigning a partition to a specific UI component and its business logic, you can track changes just on that state partition for easier debugging of a new component and its separated business logic.
- To implement causality, causality-redux exposes two main concepts, changers which initiate a cause and subscribers that subscribe as an effect to the cause. The programming steps taken by the subscriber as a result of the cause is the effect.
- Specific keys within a partition can be targeted by a subscriber of state changes. So, the subscriber is not called unless one of the targets is changed.
- The subscriber is called with the targeted keys/values that changed as an argument so that it does not need to call getState to figure out if the state changes apply to the subscriber.
- In most cases changers/dispatchers do not need to be defined or coded. They are automatically generated by causality-redux.
- In most cases reducers do not need to be defined or coded. They are automatically generated by causality-redux.           
- Type checking of arguments is performed for most changers in order to catch coding errors early.
- Connecting changers and partition values to react components takes only one line of code. mapStateToProps and mapDispatchToProps definitions are no longer needed.
- React PropType definitions are not needed unless they represent component configurations because causality-redux does all of the type checking of arguments and automatically validates functions that are set to props in react components.
- Business logic functions do not need to be passed down the react UI tree as props. A react component simply binds to a changer string name that causes a state change in which business logic subscribes to the change and implements the causality chain. So a react component can be a fully functional business logic/UI unit without any dependencies on the containing react UI tree.
- UI components do not need to import business logic functions or reference them since the components bind to changer string names instead of business functions. So, neither the business logic nor the UI components need to import anything about the other.
- Allows hot re-loading of business code for easier debugging.
- Provides middleware between business code and UI such as react or another other UI implementation. UI implementations come and go and with causality-redux you do not have to tear out your business code from the UI. There is a clean separation between the two with no importing needed from each other. So, if the UI implementation changes in the future, you only need to worry about the UI.
- Causality-redux supports three types of plugins:
  - Complete self contained react web component plugins that can be simply inserted into the UI. 
  - Business logic plugins that are easily connected to UI components with one line of code.
  - Reducer plugins to supplement built-in causality-redux reducers.
- Causality-redux is very small only 6K gzipped.

If you are using react, see [Github react-causality-redux](https://github.com/AndrewBanks10/react-causality-redux) for the react extension to causality-redux.

## Documentation

You can find documentation at <https://cazec.com/causalityredux/causalityredux.html>

## Demos with source code.
- [General Demo](https://cazec.com/causalityredux/causalityreduxdemo.html) - Demonstates general features of react-causality-redux.
- [Todo Demo](https://cazec.com/causalityredux/todo.htm) - React demo that provides the same functionality as 100 redux lines of code in just 8 lines. 
- [Counter Demo](https://cazec.com/causalityredux/countertest.html) - Show a counter example and also how to access external business logic without any import of the business functions or injecting react props from the top down.

## NPM links

[npm causality-redux](https://www.npmjs.com/package/causality-redux)

[npm causality-redux react extension](https://www.npmjs.com/package/react-causality-redux)

## Github links

[Github causality-redux](https://github.com/AndrewBanks10/causality-redux)

[Github causality-redux react extension](https://github.com/AndrewBanks10/react-causality-redux)

### VS Code template for developing with es6, jsx react and causality-redux.
The template supports the following features.
* es6 and jsx.
* Total separation of react UI components from program state and business code.
* Major extensions and simplifications to redux.
* Can use the assignment operator on causality-redux store values to automatically update the react UI. No changers, reducers, etc are needed.
* Vscode debugging and hot re-loading on a file save within react code or the business code. 
* Css modules.
* Sass, scss and less. 
* Sass, scss, less and css injections into your react components.
* Legacy css code.
* Postcss-loader so you do not have to use vendor prefixes in your css code.
* Url-loader for assets such as images, fonts etc that can be imported into your react components.
* Mocha react/enzyme testing.
* Mocha test vscode debugging that uses webpack to automatically compile changes made to the test code. 
* Dll libraries for fast compiling while debugging and/or for production.
* Minimized production build for both css and js.
* Many code samples that demonstrate the use of causality-redux with react.

[Github causality-redux react vscode hot loading and debug template](https://github.com/AndrewBanks10/react-causality-redux-vscode-template)

