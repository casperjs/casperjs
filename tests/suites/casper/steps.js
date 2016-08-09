/*eslint strict:0*/
casper.test.begin('steps tests', 8, function(test) {
    casper.start('tests/site/index.html');

    var nsteps = casper.steps.length;

    casper.then(function(response) {
        test.assertTitle('CasperJS test index',
            'Casper.then() added a new step');
    });

    test.assertEquals(casper.steps.length, nsteps + 1,
        'Casper.then() can add a new step');

    casper.thenOpen('tests/site/test.html');

    test.assertEquals(casper.steps.length, nsteps + 2,
        'Casper.thenOpen() can add a new step');

    casper.thenOpen('tests/site/test.html', function() {
        test.assertTitle('CasperJS test target',
            'Casper.thenOpen() opened a location and executed a step');
    });

    test.assertEquals(casper.steps.length, nsteps + 4,
        'Casper.thenOpen() can add a new step for opening, plus another step');

    casper.each([1, 2, 3], function(self, item, i) {
        test.assertEquals(i, item - 1,
            'Casper.each() passes a contextualized index');
    });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('eachThen() tests', 2, function(test) {
    var received = [];
    var receivedFalsy = [];

    casper.start().eachThen([1, 2, 3], function(response) {
        if (!response) {
            test.fail('No response received');
        }
        received.push(response.data);
    });

    casper.then(function() {
        test.assertEquals(received, [1, 2, 3],
            'Casper.eachThen() passes item to step data');
    });

    casper.eachThen([false, 0, ''], function(response) {
        if (!response) {
            test.fail('No response received');
        }
        receivedFalsy.push(response.data);
    });

    casper.then(function() {
        test.assertEquals(receivedFalsy, [false, 0, ''],
            'Casper.eachThen() passes falsy items to step data');
    });

    casper.run(function() {
        test.done();
    });
});
