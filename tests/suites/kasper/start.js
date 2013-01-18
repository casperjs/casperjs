/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('start() tests', 4, function(test) {
    kasper.start('tests/site/index.html', function() {
        test.pass('kasper.start() can chain a next step');
        test.assertTitle('kasperJS test index', 'kasper.start() opened the passed url');
        test.assertEval(function() {
            return typeof(__utils__) === "object";
        }, 'kasper.start() injects ClientUtils instance within remote DOM');
    });

    test.assert(kasper.started, 'kasper.start() started');

    kasper.run(function() {
        test.done();
    });
});
