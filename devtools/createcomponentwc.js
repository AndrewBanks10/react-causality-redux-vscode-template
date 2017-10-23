const path = require('path');
const fs = require('fs');
const readline = require('readline');

const configCommon = require('./webpack.config.config');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const controllerCode = (component, isMultiple) => {
    let code =
        `import CausalityRedux from 'causality-redux';
`;
    if (isMultiple)
        code += `import {${component}} from './view';`;
    else
        code += `import ${component} from './view';`;    

    code += `

// TODO: Define the partition store definition
const defaultState = {
    sampleKey1: ''
};

// TODO: Define Controller functions available to the UI.
const controllerFunctions = {
    sampleFunction1: (url) => {
        partitionState.sampleKey1 = url;
    }
};

`;
    if (isMultiple)
        code +=
`export const ${component}_Partition = '${component}_Partition';

//TODO: Add your UI props connections here.
const controllerUIConnections = [
    [${component}, ${component}_Partition, ['sampleFunction1'], ['sampleKey1'], '${component}']
];

const { partitionState, setState } = CausalityRedux.establishControllerConnections({
    module, 
    partition: { partitionName: ${component}_Partition, defaultState, controllerFunctions },
    controllerUIConnections
});

// Export the redux connect component. Use this in the parent component(s).
export default partitionState.${component};
`;
    else    
        code +=   
`export const ${component}_Partition = '${component}_Partition';

const { partitionState, setState, uiComponent } = CausalityRedux.establishControllerConnections({
    module,
    partition: { partitionName: ${component}_Partition, defaultState, controllerFunctions },
    uiComponent: ${component}, 
    uiComponentName: '${component}'
});

export default uiComponent;`;
    return code;    
};

const viewCode = (component, isMultiple) => {
    let code = `import React from 'react';

`;

    if (isMultiple)
        code +=
            `export const ${component} = (/*{sampleKey1, sampleFunction1}*/) =>
    <div>
    TODO: Define your component.
    </div>;`;
    else
        code +=
            `const ${component} = (/*{sampleKey1, sampleFunction1}*/) =>
    <div>
    TODO: Define your component.
    </div>;

export default ${component};`;
    return code;    
};

const modelCode = () =>
`//  TODO: Add your business functions
`;

rl.question('Name of MVC react component: ', (component) => {
    rl.question('Is this a multiple component (Y/N): ', (isMultiple) => {
        if (isMultiple === 'y')
        isMultiple = 'Y'; 
        isMultiple = isMultiple === 'Y';
        rl.close();
        const dir = path.join(configCommon.sourceDir, configCommon.reactcomponentsdirectory, component);
        if (fs.existsSync(dir)) {
            console.log(`The directory ${dir} already exists.`);
            return;
        }
        
        fs.mkdirSync(dir);
        fs.writeFileSync(path.join(dir, 'controller.js'), controllerCode(component, isMultiple));
        fs.writeFileSync(path.join(dir, 'view.jsx'), viewCode(component, isMultiple));
        fs.writeFileSync(path.join(dir, 'model.js'), modelCode());
        console.log(`MvC React Component ${component} generated.`);
    })
});

