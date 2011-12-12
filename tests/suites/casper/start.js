(function(t) {
    t.comment('Casper.start()');

    casper.start('tests/site/index.html', function(self) {
        t.pass('Casper.start() can chain a next step');
        t.assertTitle('CasperJS test index', 'Casper.start() opened the passed url');
        t.assertEval(function() {
            return typeof(__utils__) === "object";
        }, 'Casper.start() injects ClientUtils instance within remote DOM');
    });

    t.assert(casper.started, 'Casper.start() started');

    casper.run(function(self) {
        t.done();
    });
})(casper.test);
