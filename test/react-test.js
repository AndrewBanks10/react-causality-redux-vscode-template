import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
// Must be included before any react components
import '../src/causality-redux/init';
import App from '../src/react-components/app';

// Mount the App
const appMount = mount(<App />);

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

const nodeExists = selector => appMount.find(selector).exists();
const nodeString = selector => appMount.find(selector).text();
const simulateClick = selector => appMount.find(selector).first().simulate('click');

const testCauseAndEffectWithExists = (causeSelector, effectSelector, done) => {
    simulateClick(causeSelector);
    handleReactAsyncStart(done, waitTime, () => 
        nodeExists(effectSelector)
    );
};

const testCauseAndEffectWithNotExists = (causeSelector, effectSelector, done) => {
    simulateClick(causeSelector);
    handleReactAsyncStart(done, waitTime, () => 
        !nodeExists(effectSelector)
    );
};

const testCauseAndEffectWithHtmlString = (causeSelector, effectSelector, expectedHtmlString, done) => {
    simulateClick(causeSelector);
    handleReactAsyncStart(done, waitTime, () =>
        nodeString(effectSelector) === expectedHtmlString
    );
};


//
// This verifies the react-news component and its business logic.
//
describe('Operations NewsSources', () => {
    // Prove there are no news sources
    it('getNewsSourcesEffect does not exist - validated.', () => {
        assert(!nodeExists('[data-newsRow]'));
    });
 
    // Now click on the news source button and wait for the effect.   
    it('getNewsSources cause and effect - validated.', done => {
        testCauseAndEffectWithExists('#getNewsSources', '[data-newsRow]', done);
    });

    // Prove there are no news articles    
    it('getNewsEffect does not exist - validated.', () => {
        assert(!nodeExists('#getNewsEffect'));
    });
 
    // Click on the first news source to get all the latest news from that source.  
    // Wait for the news to come back.
    it('getNews cause and effect - validated.', done => {
        testCauseAndEffectWithExists('[data-newsRow]', '#getNewsEffect', done);
    });

    // Click on the close news. Prove it works.
    it('Exit news - validated.', done => {
        testCauseAndEffectWithNotExists('#closeNews', '#getNewsEffect', done);
    });    

    // Clear out the news sources. Prove it works.    
    it('getNewsSources cleared validated.', done => {
        testCauseAndEffectWithNotExists('#clearNewsSources', '[data-newsRow]', done);
    });

});

describe('Counter Test', () => {
 
    // Click on the increment button  
    it('increment cause and effect 1 - validated.', done => {
        testCauseAndEffectWithHtmlString('#onIncrement', '#counter-text', 'The current counter is 1.', done);
    });

    // Click on the increment button  
    it('increment cause and effect 2 - validated.', done => {
        testCauseAndEffectWithHtmlString('#onIncrement', '#counter-text', 'The current counter is 2.', done);
    });

     // Click on the decrement button  
    it('decrement cause and effect 1 - validated.', done => {
        testCauseAndEffectWithHtmlString('#onDecrement', '#counter-text', 'The current counter is 1.', done);
    });

     // Click on the decrement button  
    it('decrement cause and effect 2 - validated.', done => {
        testCauseAndEffectWithHtmlString('#onDecrement', '#counter-text', 'The current counter is 0.', done);
    });

});


