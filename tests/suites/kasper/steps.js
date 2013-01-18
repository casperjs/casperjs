/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('steps tests', 8, function(test) {
    kasper.start('tests/site/index.html');

    var nsteps = kasper.steps.length;

    kasper.then(function(response) {
        test.assertTitle('kasperJS test index',
            'kasper.then() added a new step');
    });

    test.assertEquals(kasper.steps.length, nsteps + 1,
        'kasper.then() can add a new step');

    kasper.thenOpen('tests/site/test.html');

    test.assertEquals(kasper.steps.length, nsteps + 2,
        'kasper.thenOpen() can add a new step');

    kasper.thenOpen('tests/site/test.html', function() {
        test.assertTitle('kasperJS test target',
            'kasper.thenOpen() opened a location and executed a step');
    });

    test.assertEquals(kasper.steps.length, nsteps + 4,
        'kasper.thenOpen() can add a new step for opening, plus another step');

    kasper.each([1, 2, 3], function(self, item, i) {
        test.assertEquals(i, item - 1,
            'kasper.each() passes a contextualized index');
    });

    kasper.run(function() {
        test.done();
    });
});
