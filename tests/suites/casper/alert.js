/*global casper*/
/*jshint strict:false*/
casper.test.begin('alert events', 1, function(test) {
    var ok = false;
    casper.once('remote.alert', function(message) {
        ok = message === 'plop';
    });
    casper.start('tests/site/alert.html', function() {
        test.assert(ok, 'alert event has been intercepted');
    });
    casper.run(function() {
        this.removeAllListeners('remote.alert');
        test.done();
    });
});
