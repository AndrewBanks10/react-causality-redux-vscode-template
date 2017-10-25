/* eslint no-empty:0 */
/* eslint no-console:0 */

const path = require('path');
const fs = require('fs');
const config = require('./webpack.config.config');

function writeFile(directory, strFile) {
    fs.writeFileSync(directory, strFile);
}

function mkdir(directory) {
    try {
        fs.mkdirSync(directory);
    } catch (ex) {
        
    }
}

const newLine = () =>
`
`; 
const spaces = (amt) => {
    let str = '';
    for ( let i = 0; i < amt; ++i)
        str += ' ';
    return str;
};

const reactComponentsPath = path.join(config.sourceDir, config.reactcomponentsdirectory);

const  useReactRouter = () =>
    config.useReactRouterWithTimeTravel || config.useReactRouterWithoutTimeTravel;

function handleDirectories() {
    if (fs.existsSync(config.sourceDir)) {
        console.log('The project is already created.');
        return;
    }
    
    mkdir(config.sourceDir);
    mkdir(config.testDirectory);

    mkdir(reactComponentsPath);
    mkdir(path.join(config.sourceDir, config.assetsDirectory));
    if ( config.useCSSModules === 2 )
        mkdir(path.join(config.sourceDir, config.noCSSModulesName));
}

function handleStylesheets() {
    //
    // Use global stylesheets
    // 
    if (config.useCSSModules !== 1) {
        const cssFile =
`//
// TODO: Import stylesheets here that do not support modules.
// Used for global stylesheets. They will be in the '${config.noCSSModulesName}' directory.
// Note. If you do not import them here then they will not be included in the build.
//

// Example import './${config.noCSSModulesName}/header.1';

// hot re-load support for the css above.
if (module.hot)
    module.hot.accept();
`;
        writeFile(path.join(config.sourceDir, 'css.js'), cssFile);    
    }
}

function handleIndexCommon() {
    //
    // index-common.js
    //
    let index_common =
`import React from 'react';
import { render } from 'react-dom';
`;

    if (config.useCSSModules !== 1) {
        index_common += 'import \'css\';';
        index_common += newLine();
    }
        
    if (config.useCausalityRedux) {
        index_common += 'import \'./causality-redux/init\';';
        index_common += newLine();
    }

    index_common += `import App from './${config.reactcomponentsdirectory}/App';`;
    index_common += newLine();
    index_common += newLine();
    index_common += 
`const reactRootId = 'reactroot';
const reactMountNode = document.getElementById(reactRootId);

export { App, React, render, reactMountNode };
export default App;`;

    writeFile(path.join(config.sourceDir, 'index-common.js'), index_common);      
}

function handleDllLibraries() {
    const dllFiles = ['react', 'react-dom'];
    if (config.useCausalityRedux) {
        dllFiles.push('redux');
        dllFiles.push('react-redux');
        dllFiles.push('causality-redux');
        dllFiles.push('react-causality-redux');
    }
    if (useReactRouter()) {
        if (config.useReactRouterWithTimeTravel)
            dllFiles.push('react-causality-redux-router');
        dllFiles.push('react-router-dom');
        dllFiles.push('history');
    }
    if (config.useMaterialUI)
        dllFiles.push('material-ui');
    
    let dllFile = 'module.exports = [';
    
    for (let i = 0; i < dllFiles.length; ++i) {
        if (i !== 0)
            dllFile += ','; 
        dllFile += newLine();
        dllFile += spaces(4);
        dllFile += `'${dllFiles[i]}'`;
        if (i === dllFiles.length-1)
            dllFile += newLine();
    }

    dllFile += '];';
    writeFile(path.join('devtools', 'projectdllmodules.js'), dllFile);  
}

function handleHistoryFile() {
    if (useReactRouter()) {
        mkdir(path.join(config.sourceDir, 'history'));
        let historyfile = ''; 
        if (config.useCausalityRedux) {
            if ( config.useReactRouterWithTimeTravel )
                historyfile += 'import createBrowserHistory from \'react-causality-redux-router\';';
            else
                historyfile += 'import { createBrowserHistory } from \'history\';';    
            historyfile += newLine();
        } else {
            historyfile += 'import { createBrowserHistory } from \'history\';';
            historyfile += newLine();       
        }
        historyfile += 'const history = createBrowserHistory();';
        historyfile += newLine();
        historyfile += 'export default history;';
        writeFile(path.join(config.sourceDir, 'history', 'history.js'), historyfile);  
    }     
}

function handleCausalityRedux() {
    //
    // causality-redux/init.js
    //
    if (!config.useCausalityRedux)
        return;    
    const dir = path.join(config.sourceDir, 'causality-redux');  
    fs.mkdirSync(dir);
    const cr = 
`import CausalityRedux from 'causality-redux';
import 'react-causality-redux';

CausalityRedux.createStore();`;
    writeFile(path.join(dir, 'init.js'), cr);      
}

function handleApp() {

    //
    // App.js
    //
    let App = 'import React from \'react\';';
    App += newLine(); 

    if (config.useCausalityRedux) {
        App += `import CausalityRedux from 'causality-redux';
import { Provider } from 'react-redux';
`;
    }

    if (useReactRouter()) {
        App += 'import { Router } from \'react-router-dom\';';
        App += newLine();
        App += 'import history from \'../history/history\';';
        App += newLine(); 

    }    

    if (config.useMaterialUI)
        App += `import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
`;
    
    App += `import MainApp from './MainApp/MainApp';

const App = () =>
`;

    let indentSpaces = 4;
    const tagstack = [];
    const closeTagstack = [];

    if (config.useCausalityRedux) {
        tagstack.push({
            str: `<Provider store={CausalityRedux.store}>
`, indentSpaces});
        closeTagstack.push('</Provider>');
        indentSpaces += 4;
    }  

    if (useReactRouter()) {
        tagstack.push({
            str: `<Router history={history}>
`, indentSpaces});
        closeTagstack.push('</Router>');
        indentSpaces += 4;
    } 

    if (config.useMaterialUI) {
        tagstack.push({
            str: `<MuiThemeProvider>
`, indentSpaces});
        closeTagstack.push('</MuiThemeProvider>');
        indentSpaces += 4;
    } 

    for (let i = 0; i < tagstack.length; ++i) {
        App += spaces(tagstack[i].indentSpaces);
        App += tagstack[i].str;
    }

    App += spaces(indentSpaces);
    App += '<MainApp/>';
    if (tagstack.length > 0)
        App += newLine();

    for (let i = tagstack.length - 1; i >= 0; --i) {
        App += spaces(tagstack[i].indentSpaces);
        App += closeTagstack[i];
        if ( i !== 0)
            App += newLine();   
    }

    App += `;

export default App;`;

    writeFile(path.join(reactComponentsPath, 'App.jsx'), App);  

}

function handleMainApp() {
    //
    // MainApp
    //
    const mainAppPath = path.join(reactComponentsPath, 'MainApp');
    mkdir(mainAppPath);

    let mainApp = 'import React from \'react\';';
    mainApp += newLine();

    if (useReactRouter()) {
        mainApp += `
import { Switch, Route, Redirect } from 'react-router-dom';
    
// TODO: Put your route strings here so that they may be imported from this module
// when a router <Link> is needed
export const HOMEROUTE = '/';
    
const MainApp = () =>
    <Switch>
        {/* TODO: Put your routes here example: <Route exact path={HOMEROUTE} component={HomeApp} /> */}
        <Redirect to={HOMEROUTE} />
    </Switch>;
`;
    } else {
        mainApp += `
const MainApp = () =>
    {/* TODO: Put your react component(s) here. */};
`;
    }        
    
    mainApp += newLine();
    mainApp += 'export default MainApp;';

    writeFile(path.join(mainAppPath, 'MainApp.jsx'), mainApp);     
}

function buildServerIndexFiles() {
    const index =
`import { React, render, App, reactMountNode } from './index-common';
    
render(
    <App />,
    reactMountNode
);`;

    writeFile(path.join(config.sourceDir, 'index.js'), index); 
    
    const index_dev =
        `import { React, render, App, reactMountNode } from './index-common';
import { AppContainer } from 'react-hot-loader';

//
// The below is the necessary technique to utilize hot re-loading of react.
// 
const renderRoot = (TheApp) => {
    render(
        <AppContainer warnings={false}>
            <TheApp/>
        </AppContainer>,
        reactMountNode
    );
};

// First module render.
renderRoot(App);

//
// Hot reload support for react. If any of the react components change this will
// hot reload all changed components and then re-render the root
//
if (module.hot) {
    module.hot.accept('./index-common', () => {
        // The below requires the location of App or whatever is used for the root component
        // The require('./index-common') brings in a new copy of the App module.
        // react will handle keeping the props and state the same after the load. 
        renderRoot(require('./index-common').default);
    });
}`; 
    writeFile(path.join(config.sourceDir, 'index.dev.js'), index_dev);     
}

function handleTestDirectory() {
    const setup =
        `const { JSDOM } = require('jsdom');
    
const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
});
const { window } = jsdom;
global.window = window;
global.document = window.document;

//
// Put all of your window features that are missing from jsdom that you need here.
//
    
Object.keys(global.window).forEach( property => {
    if (typeof global[property] === 'undefined') {
        global[property] = global.window[property];
    }
});
    
global.navigator = {
    userAgent: 'node.js'
};`;

    writeFile(path.join('test', 'setup.js'), setup);  

    let reacttest = '';

    reacttest =
        `import React from 'react';
import { mount } from 'enzyme';
`;
    if (config.useCSSModules !== 1) {
        reacttest += 'import \'../src/css\';';
        reacttest += newLine();
    }
        
    if (config.useCausalityRedux) {
        reacttest += 'import \'../src/causality-redux/init\';';
        reacttest += newLine();
    }    

    reacttest += `import App from '../src/${config.reactcomponentsdirectory}/App';
    
// Mount the App
const appMount = mount(<App />);

export default appMount;`;

    writeFile(path.join('test', 'mountapp.js'), reacttest);

    const projectsetup =
`import appMount from './mountapp';

const waitTime = 2000;
let intervalID;

//
// React rendering is asynchronous. Components must be validated asynchronously.
//
const handleReactAsync = (done, startTime, waitTime, callbackCheck) => {
    // The callback checks that the conditions for success have been met
    if ( callbackCheck() ) {
        clearInterval(intervalID);
        done();
    // Timeout means failure.
    } else if (new Date() - startTime > waitTime) {
        clearInterval(intervalID);
        done(new Error('Timeout'));
    }
};

const handleReactAsyncStart = (done, waitTime, callbackCheck) => {
    intervalID = setInterval(handleReactAsync, 10, done, new Date(), waitTime, callbackCheck);
};

export const nodeExists = selector => appMount.find(selector).exists();
export const nodeString = selector => appMount.find(selector).text();
export const simulateClick = selector => appMount.find(selector).first().simulate('click');

export const testCauseAndEffectWithExists = (causeSelector, effectSelector, done) => {
    simulateClick(causeSelector);
    handleReactAsyncStart(done, waitTime, () => 
        nodeExists(effectSelector)
    );
};

export const testCauseAndEffectWithNotExists = (causeSelector, effectSelector, done) => {
    simulateClick(causeSelector);
    handleReactAsyncStart(done, waitTime, () => 
        !nodeExists(effectSelector)
    );
};

export const testCauseAndEffectWithHtmlString = (causeSelector, effectSelector, expectedHtmlString, done) => {
    simulateClick(causeSelector);
    handleReactAsyncStart(done, waitTime, () =>
        nodeString(effectSelector) === expectedHtmlString
    );
};`;

    writeFile(path.join('test', 'projectsetup.js'), projectsetup);  
}

function buildProject() {
    handleDirectories();
    handleStylesheets();
    handleIndexCommon();
    handleDllLibraries();
    handleCausalityRedux();
    handleApp();
    handleMainApp();
    buildServerIndexFiles();
    handleHistoryFile();

    handleTestDirectory();

    console.log('React project created.');
}

buildProject();







