(function(t) {
    casper.start('tests/site/index.html');

    var oldLevel = casper.options.logLevel;

    casper.options.logLevel = 'info';
    casper.options.verbose = false;

    t.comment('Casper.log()');
    casper.log('foo', 'info');
    t.assert(casper.result.log.some(function(e) {
        return e.message === 'foo' && e.level === 'info';
    }), 'Casper.log() adds a log entry');

    casper.options.logLevel = oldLevel;
    casper.options.verbose = true;

    casper.then(function(self) {
        var oldLevel = casper.options.logLevel;
        casper.options.logLevel = 'debug';
        casper.options.verbose = false;
        casper.evaluate(function() {
            __utils__.log('debug message');
            __utils__.log('info message', 'info');
        });
        t.assert(casper.result.log.some(function(e) {
            return e.message === 'debug message' && e.level === 'debug' && e.space === 'remote';
        }), 'ClientUtils.log() adds a log entry');
        t.assert(casper.result.log.some(function(e) {
            return e.message === 'info message' && e.level === 'info' && e.space === 'remote';
        }), 'ClientUtils.log() adds a log entry at a given level');
        casper.options.logLevel = oldLevel;
        casper.options.verbose = true;
    });

    casper.run(function(self) {
        t.assertEquals(self.result.log.length, 3, 'Casper.log() logged messages');
        t.done();
    });
})(casper.test);
