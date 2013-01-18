/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('onStepComplete() hook tests', 1, function(test) {
    var stepResults = [];
    kasper.options.onStepComplete = function(self, stepResult) {
        stepResults.push(stepResult);
    };
    kasper.start('tests/site/index.html', function() {
        return 'ok';
    });
    kasper.run(function() {
        test.assert(stepResults.indexOf('ok') > -1,
            'kasper.options.onStepComplete() is called on step complete');
        this.options.onStepComplete = undefined;
        test.done();
    });
});

kasper.test.begin('onResourceRequested() & onResourceReceived() hook tests', 6, function(test) {
    var requests = [], responses = [];
    kasper.options.onResourceRequested = function(self, request) {
        requests.push(request);
    };
    kasper.options.onResourceReceived = function(self, response) {
        responses.push(response);
    };
    kasper.start('tests/site/index.html', function() {
        test.assert(requests.some(function(request) {
            return (/index\.html$/).test(request.url);
        }), 'onResourceRequested() receives page requests');
        test.assert(requests.some(function(request) {
            return (/phantom\.png$/).test(request.url);
        }), 'onResourceRequested() receives image requests');
        test.assert(responses.some(function(response) {
            return response.stage === 'start' && (/index\.html$/).test(response.url);
        }), 'onResourceReceived() receives page response on load start');
        test.assert(responses.some(function(response) {
            return response.stage === 'end' && (/index\.html$/).test(response.url);
        }), 'onResourceReceived() receives page response on load end');
        test.assert(responses.some(function(response) {
            return response.stage === 'start' && (/phantom\.png$/).test(response.url);
        }), 'onResourceReceived() receives image response on load start');
        test.assert(responses.some(function(response) {
            return response.stage === 'end' && (/phantom\.png$/).test(response.url);
        }), 'onResourceReceived() receives image response on load end');
    });
    kasper.run(function() {
        this.options.onResourceReceived = this.options.onResourceRequested = undefined;
        test.done();
    });
});

kasper.test.begin('onAlert() hook tests', 1, function(test) {
    var message;
    kasper.options.onAlert = function(self, msg) {
        message = msg;
    };
    kasper.start('tests/site/alert.html', function() {
        test.assertEquals(message, 'plop', 'kasper.options.onAlert() can intercept an alert message');
    });
    kasper.run(function() {
        this.options.onAlert = null;
        test.done();
    });
});
