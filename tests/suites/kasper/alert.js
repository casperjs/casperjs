/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('alert events', 1, function(test) {
    var ok = false;
    kasper.once('remote.alert', function(message) {
        ok = message === 'plop';
    });
    kasper.start('tests/site/alert.html', function() {
        test.assert(ok, 'alert event has been intercepted');
    });
    kasper.run(function() {
        this.removeAllListeners('remote.alert');
        test.done();
    });
});
