/*global casper*/
/*jshint strict:false*/
casper.test.begin('Skip tests', 2, function(test) {
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

casper.test.begin('Skip multiple', 3, function(test) {
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

casper.test.begin('Skip does not polluate next suite', 1, function(test) {
    casper.
        then(function () {
            test.pass("This test should be executed.");
        });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('Casper.thenSkip', 2, function(test) {
    casper.
        thenSkip(1).
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

casper.test.begin('Casper.thenSkipIf', 5, function(test) {
    casper.
        thenSkipIf(true, 1, "Skip if with function").
        then(function () {
            test.fail("This test should be skipped.");
        }).
        then(function () {
            test.pass("This test should be executed.");
        }).
        thenSkipIf(function () {
            return true;
            }, 1, "Skip if with function").
        then(function () {
            test.fail("This test should be skipped.");
        }).
        then(function () {
            test.pass("This test should be executed.");
        }).
        thenSkipIf(function () {
            return false;
            }, 1, "Do not skip if with function").
        then(function () {
            test.pass("This test should be executed.");
        });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('Casper.thenSkipUnless', 5, function(test) {
    casper.
        thenSkipUnless(false, 1, "Skip unless with function").
        then(function () {
            test.fail("This test should be skipped.");
        }).
        then(function () {
            test.pass("This test should be executed.");
        }).
        thenSkipUnless(function () {
            return false;
            }, 1, "Skip unless with function").
        then(function () {
            test.fail("This test should be skipped.");
        }).
        then(function () {
            test.pass("This test should be executed.");
        }).
        thenSkipUnless(function () {
            return true;
            }, 1, "Do not skip unless with function").
        then(function () {
            test.pass("This test should be executed.");
        });

    casper.run(function() {
        test.done();
    });
});

