/*jshint strict:false*/
/*global kasper __utils__*/
kasper.test.begin('logging tests', 4, function(test) {
    kasper.start('tests/site/index.html');

    var oldLevel = kasper.options.logLevel;

    kasper.options.logLevel = 'info';
    kasper.options.verbose = false;

    kasper.log('foo', 'info');
    kasper.test.assert(kasper.result.log.some(function(e) {
        return e.message === 'foo' && e.level === 'info';
    }), 'kasper.log() adds a log entry');

    kasper.options.logLevel = oldLevel;
    kasper.options.verbose = true;

    kasper.then(function() {
        var oldLevel = kasper.options.logLevel;
        kasper.options.logLevel = 'debug';
        kasper.options.verbose = false;
        kasper.evaluate(function() {
            __utils__.log('debug message');
            __utils__.log('info message', 'info');
        });
        test.assert(kasper.result.log.some(function(e) {
            return e.message === 'debug message' && e.level === 'debug' && e.space === 'remote';
        }), 'ClientUtils.log() adds a log entry');
        test.assert(kasper.result.log.some(function(e) {
            return e.message === 'info message' && e.level === 'info' && e.space === 'remote';
        }), 'ClientUtils.log() adds a log entry at a given level');
        kasper.options.logLevel = oldLevel;
        kasper.options.verbose = true;
    });

    kasper.run(function() {
        test.assertEquals(this.result.log.length, 3, 'kasper.log() logged messages');
        test.done();
    });
});
