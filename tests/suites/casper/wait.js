/*global casper*/
/*jshint strict:false*/
casper.test.begin('wait*() tests', 4, function(test) {
    var waitStart;

    casper.start('tests/site/index.html', function() {
        waitStart = new Date().getTime();
    });

    casper.wait(250, function() {
        test.assert(new Date().getTime() - waitStart > 250,
            'Casper.wait() can wait for a given amount of time');
    });

    casper.thenOpen('tests/site/waitFor.html', function() {
        this.waitFor(function() {
            return this.evaluate(function() {
                return document.querySelectorAll('li').length === 4;
            });
        }, function() {
            test.pass('Casper.waitFor() can wait for something to happen');
        }, function() {
            test.fail('Casper.waitFor() can wait for something to happen');
        });
    });

    casper.thenOpen('tests/site/waitFor.html').waitForText('<li>four</li>', function() {
        test.pass('Casper.waitForText() can wait for text');
    }, function() {
        test.fail('Casper.waitForText() can wait for text');
    });

    casper.thenOpen('tests/site/waitFor.html').waitForText(/four/i, function() {
        this.test.pass('Casper.waitForText() can wait for regexp');
    }, function() {
        this.test.fail('Casper.waitForText() can wait for regexp');
    });

    casper.run(function() {
        test.done();
    });
});
