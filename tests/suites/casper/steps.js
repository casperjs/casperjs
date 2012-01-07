(function(t) {
    t.comment('Casper.then()');

    casper.start('tests/site/index.html');

    var nsteps = casper.steps.length;

    casper.then(function(self) {
        t.assertTitle('CasperJS test index', 'Casper.then() added a new step');
    });

    t.assertEquals(casper.steps.length, nsteps + 1, 'Casper.then() can add a new step');

    t.comment('Casper.thenOpen()');

    casper.thenOpen('tests/site/test.html');

    t.assertEquals(casper.steps.length, nsteps + 2, 'Casper.thenOpen() can add a new step');

    casper.thenOpen('tests/site/test.html', function(self) {
        t.assertTitle('CasperJS test target', 'Casper.thenOpen() opened a location and executed a step');
    });

    t.assertEquals(casper.steps.length, nsteps + 4, 'Casper.thenOpen() can add a new step for opening, plus another step');

    t.comment('Casper.each()');
    casper.each([1, 2, 3], function(self, item, i) {
        self.test.assertEquals(i, item - 1, 'Casper.each() passes a contextualized index');
    });

    casper.run(function() {
        t.done();
    });
})(casper.test);
