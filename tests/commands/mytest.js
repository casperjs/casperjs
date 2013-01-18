/*jshint strict:false*/
/*global kasperError kasper console phantom require*/
kasper.start('about:blank', function() {
    this.test.pass('ok1');
});

kasper.then(function() {
    this.test.pass('ok2');
});

kasper.run(function() {
    this.test.pass('ok3');
    this.test.done();
});
