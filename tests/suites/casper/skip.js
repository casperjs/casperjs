/*global casper*/
/*jshint strict:false*/
casper.test.begin('Skip tests', 1, function(test) {
    casper.start('tests/site/index.html');

    casper.
        then(function () {
            test.skip(1);
        }).
        then(function () {
            test.fail("This test should be skipped.");
        }).
        then(function () {
            test.pass("This test should be executed.");
        });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('Skip multiple', 1, function(test) {
    casper.
        then(function () {
            test.skip(2);
        }).
        then(function () {
            test.fail("This test should be skipped.");
        }).
        then(function () {
            test.fail("This test should be skipped.");
        }).
        then(function () {
            test.pass("This test should be executed.");
        });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('Skip more than there is', 0, function(test) {
    casper.
        then(function () {
            test.skip(2);
        });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('Next suite should be executed', 1, function(test) {
    casper.
        then(function () {
            test.pass("This test should be executed.");
        });

    casper.run(function() {
        test.done();
    });
});

