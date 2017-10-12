const path = require('path');
const fs = require('fs');

const configCommon = require('./webpack.config.common');


const controllerCode = (component) =>
`import CausalityRedux from 'causality-redux';
import ${component} from './view';

/*
 TODO: Define the partition store definition
*/
const defaultState = {
    sampleKey1: '',
    sampleKey2: []
};

/*
 TODO: Define Controller functions available to the UI.
 Use partitionState to access the keys of default state in these functions.
 partitionState is a proxy that returns a copy of the value at the selected key.
 let value = partitionState.key;
 modify value.
 To set a key do partitionState.key = value;
 use setState to set multiple keys like setState({key1: val1, key2: val2});
*/
const controllerFunctions = {
    sampleFunction1: (url) => {
        partitionState.sampleKey1 = url;
    },
    sampleFunction2: (e) => {
        // Note partitionState returns a copy of the value at the key.
        // So, the below must be done for objects, which are pointers in javascript.
        const arr = partitionState.sampleKey2 ;
        arr.push(e);
        partitionState.sampleKey2 = arr;
    },
    sampleFunction3: (url, arr) => {
        // Each assignment by partitionState causes a component render
        // So use the below to change multiple keys with one render.
        setState({sampleKey1: url, sampleKey2: arr});
    }
};

/*
 This establishes all the connections between the UI and business code.
 It also supports hot reloading for the business logic.
 By default, all the function keys and state keys in the partition definition will be made available in the props
 to the connect redux component uiComponent: NavMenu.
 */
const { partitionState, setState, uiComponent } = CausalityRedux.establishControllerConnections({
    module, // Needed for hot reloading.
    partition: { partitionName: '${component}_Partition', defaultState, controllerFunctions },
    uiComponent: ${component}, // Redux connect will be called on this component and returned as uiComponent in the returned object. 
    uiComponentName: '${component}' // Used for tracing.
});

// Export the redux connect component. Use this in parent components.
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
`/*
  Ideally, the business code would consist only of pure functions. However, there are cases (such as a cache)
  where business code data is needed.
  To support hot reloading, use the below for business data.
  This will create a unique redux partition for this business data in order to support hot reloading
  in this business code.

  let nonUIData = {
      whateveryouneed: [];
      numberType: 0;
  }
  const moduleData = CausalityRedux.getModuleData(process.env.NODE_ENV === 'development', nonUIData).moduleData;
 
  Then moduleData is a proxy to the redux store partitiondata.
  So, moduleData.whateveryouneed returns a copy to the data. Then to change whateveryouneed do
  let arr = moduleData.whateveryouneed;
  arr.push('1');
  moduleData.whateveryouneed = arr;

  For javascript basic data types, simply do the below.
  moduleData.numberType = 1;
  or you can do
  ++moduleData.numberType;

  
  TODO: Add your business functions
*/
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

