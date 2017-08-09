let httpReq = null;
const url = 'https://jsonplaceholder.typicode.com/todos';
let _success, _fail;

const Http = (function () {
    const errorMsg = 'Unknown network error.';

    function internalCallback(evt) {
        this.req = null;
        if (evt.target.status !== 200) {
            if (typeof this._errorCallback === 'function')
                this._errorCallback(errorMsg);
            return;
        }
        this._callback(JSON.parse(evt.target.response));
    }

    function Http() {
        this.req = null;
        this._callback;
        this._errorCallback;
    }

    Http.prototype = {
        constructor: Http,
        
        get: function (url, callback, errorCallback) {
            this._callback = callback;
            this._errorCallback = errorCallback;
            const req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.addEventListener('load', internalCallback.bind(this), false);
            req.addEventListener('error', function () { this.req = null; errorCallback(errorMsg); }, false);
            req.send(null);
            this.req = req;
        },

        abort: function () {
            if (this.req)
                this.req.abort();
            this.req = null;
        }
    };
    return Http;
})();

function handleGetReceived(arg) {
    if (httpReq === null)
        return;
    httpReq = null;
    _success(arg);
}

function handleError(msg) {
    handleAbort();
    _fail(msg);
}

export function handleGet(success, fail) {
    _success = success;
    _fail = fail;
    httpReq = new Http();
    httpReq.get(url, function (args) { setTimeout(handleGetReceived, 2000, args);}, handleError);
}

export function handleAbort() {
    if (httpReq)
        httpReq.abort();
    httpReq = null;
}


