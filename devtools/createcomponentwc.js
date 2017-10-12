const path = require('path');
const fs = require('fs');
const readline = require('readline');

const configCommon = require('./webpack.config.common');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const controllerCode = (component) =>
`import CausalityRedux from 'causality-redux';
import ${component} from './view';

// TODO: Define the partition store definition
const defaultState = {

};

// TODO: Define Controller functions available to the UI.
const controllerFunctions = {

};

const { partitionState, setState, uiComponent } = CausalityRedux.establishControllerConnections({
    module, // Needed for hot reloading.
    partition: { partitionName: '${component}_Partition', defaultState, controllerFunctions },
    uiComponent: ${component}, // Redux connect will be called on this component and returned as uiComponent in the returned object. 
    uiComponentName: '${component}' // Used for tracing.
});

export default uiComponent;`
;

const viewCode = (component) =>
`import React from 'react';

const ${component} = () =>
    <div>
    TODO: Define your component.
    </div>;

export default ${component};`
;

const modelCode = () =>
`//  TODO: Add your business functions
`;

rl.question('Name of MVC react component: ', (component) => {
    rl.close();
    const dir = path.join(configCommon.sourceDir, configCommon.reactcomponentsdirectory, component);
    if (fs.existsSync(dir)) {
        console.log(`The directory ${dir} already exists.`);
        return;
    }
    
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'controller.js'), controllerCode(component));
    fs.writeFileSync(path.join(dir, 'view.jsx'), viewCode(component));
    fs.writeFileSync(path.join(dir, 'model.js'), modelCode());
    console.log(`MvC React Component ${component} generated.`);
});

