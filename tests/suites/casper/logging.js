/*eslint strict:0*/

casper.test.begin('logging tests', 4, function(test) {
    var oldLevel;
    casper.start('tests/site/index.html');

    casper.then(casper.createStep(function() {
        oldLevel = casper.options.logLevel;

        casper.result.log = [];
        casper.options.logLevel = 'info';
        casper.options.verbose = false;
    }, {skipLog: true}));

    casper.then(casper.createStep(function() {
        casper.log('foo', 'info');
    }, {skipLog: true}));

    casper.then(casper.createStep(function() {
        test.assert(casper.result.log.some(function(e) {
            return e.message === 'foo' && e.level === 'info';
        }), 'Casper.log() adds a log entry');
    }, {skipLog: true}));

    casper.then(casper.createStep(function() {
        casper.options.logLevel = 'debug';
        casper.options.verbose = false;
        casper.evaluate(function() {
            __utils__.log('debug message');
            __utils__.log('info message', 'info');
        });
    }, {skipLog: true}));

    casper.then(casper.createStep(function() {
        test.assert(casper.result.log.some(function(e) {
            return e.message === 'debug message' && e.level === 'debug' && e.space === 'remote';
        }), 'ClientUtils.log() adds a log entry');
        test.assert(casper.result.log.some(function(e) {
            return e.message === 'info message' && e.level === 'info' && e.space === 'remote';
        }), 'ClientUtils.log() adds a log entry at a given level');
        test.assertEquals(this.result.log.length, 3, 'Casper.log() logged messages');
    }, {skipLog: true}));

    casper.run(function() {
        test.done();
        casper.options.logLevel = oldLevel;
        casper.options.verbose = false;
    });
});
