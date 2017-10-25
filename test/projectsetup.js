import appMount from './mountapp';

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
};





