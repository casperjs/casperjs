var waitStart;

casper.start('tests/site/index.html', function() {
    waitStart = new Date().getTime();
});

casper.wait(1000, function() {
    this.test.comment('Casper.wait()');
    this.test.assert(new Date().getTime() - waitStart > 1000, 'Casper.wait() can wait for a given amount of time');
    // Casper.waitFor()
    casper.thenOpen('tests/site/waitFor.html', function() {
        this.test.comment('Casper.waitFor()');
        this.waitFor(function() {
            return this.evaluate(function() {
                return document.querySelectorAll('li').length === 4;
            });
        }, function() {
            this.test.pass('Casper.waitFor() can wait for something to happen');
        }, function() {
            this.test.fail('Casper.waitFor() can wait for something to happen');
        });
    });
});

casper.run(function() {
    this.test.done();
});
