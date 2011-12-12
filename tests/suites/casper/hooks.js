(function(t) {
    // Casper.options.onStepComplete
    casper.start('tests/site/index.html', function(self) {
        self.options.onStepComplete = function(self, stepResult) {
            t.comment('Casper.options.onStepComplete()');
            t.assertEquals(stepResult, 'ok', 'Casper.options.onStepComplete() is called on step complete');
            self.options.onStepComplete = null;
        };
        return 'ok';
    });

    // Casper.options.onResourceRequested & Casper.options.onResourceReceived
    casper.then(function(self) {
        self.options.onResourceReceived = function(self, resource) {
            t.comment('Casper.options.onResourceReceived()');
            t.assertType(resource, 'object', 'Casper.options.onResourceReceived() retrieve a resource object');
            t.assert('status' in resource, 'Casper.options.onResourceReceived() retrieve a valid resource object');
            self.options.onResourceReceived = null;
        };
        self.options.onResourceRequested = function(self, request) {
            t.comment('Casper.options.onResourceRequested()');
            t.assertType(request, 'object', 'Casper.options.onResourceRequested() retrieve a request object');
            t.assert('method' in request, 'Casper.options.onResourceRequested() retrieve a valid request object');
            self.options.onResourceRequested = null;
        };
        self.thenOpen('tests/site/page1.html');
    });

    // Casper.options.onAlert()
    casper.then(function(self) {
        self.options.onAlert = function(self, message) {
            t.assertEquals(message, 'plop', 'Casper.options.onAlert() can intercept an alert message');
        };
    }).thenOpen('tests/site/alert.html').click('button', function(self) {
        self.options.onAlert = null;
    });

    casper.run(function(self) {
        t.done();
    });
})(casper.test);
