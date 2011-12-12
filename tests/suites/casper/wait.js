(function(t) {
    var waitStart;

    casper.start('tests/site/index.html', function(self) {
        waitStart = new Date().getTime();
    });

    casper.wait(1000, function(self) {
        self.test.comment('Casper.wait()');
        self.test.assert(new Date().getTime() - waitStart > 1000, 'Casper.wait() can wait for a given amount of time');
        // Casper.waitFor()
        casper.thenOpen('tests/site/waitFor.html', function(self) {
            casper.test.comment('Casper.waitFor()');
            self.waitFor(function(self) {
                return self.evaluate(function() {
                    return document.querySelectorAll('li').length === 4;
                });
            }, function(self) {
                self.test.pass('Casper.waitFor() can wait for something to happen');
            }, function(self) {
                self.test.fail('Casper.waitFor() can wait for something to happen');
            });
        });
    });

    casper.run(function(self) {
        t.done();
    });
})(casper.test);
