const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
global.window = window;
global.document = window.document;

//
// Put all of your window features that are missing from jsdom that you need here.
//

//
// This copies all the window properties to the global object.
// So, they become available to your code for testing. Note, jsdom does not support everything.
//
Object.keys(global.window).forEach( property => {
    if (typeof global[property] === 'undefined') {
        global[property] = global.window[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};




