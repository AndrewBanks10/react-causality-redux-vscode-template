const Http = (function () {
    const errorMsg = 'Unknown network error.';
    let self;
    function internalCallback(evt) {
        let response;
        let status;
        // Kludge for mocha testing.
        if (typeof evt === 'undefined') {
            response = this.responseText;
            status = this.status;
        } else {
            response = evt.target.response;
            status = evt.target.status;
        }
        self.req = null;
        if (status !== 200) {
            if (typeof self._errorCallback === 'function')
                self._errorCallback(errorMsg);
            return;
        }
        self._callback(JSON.parse(response));
    }

    function Http() {
        this.req = null;
        this._callback;
        this._errorCallback;
        self = this;
    }

    Http.prototype = {
        constructor: Http,
        
        get: function (url, callback, errorCallback) {
            this._callback = callback;
            this._errorCallback = errorCallback;
            const req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.addEventListener('load', internalCallback, false);
            req.addEventListener('error', () => { this.req = null; errorCallback(errorMsg); }, false);
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

export default Http;

