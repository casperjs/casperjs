/*global casper*/
/*jshint strict:false*/
casper.test.begin('alert events', 1, function(test) {
    var ok = false;
    casper.on('remote.alert', function(message) {
        ok = message === 'plop';
    });
    casper.start('tests/site/alert.html').run(function() {
        this.test.assert(ok, 'alert event has been intercepted');
        this.removeAllListeners('remote.alert');
        test.done();
    });
});
