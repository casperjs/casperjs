(function(t) {
    casper.start('tests/site/page1.html');
    casper.thenOpen('tests/site/page2.html');
    casper.thenOpen('tests/site/page3.html');

    casper.back();
    casper.then(function(self) {
        t.comment('navigating history backward');
        t.assertMatch(self.getCurrentUrl(), /tests\/site\/page2\.html$/, 'Casper.back() can go back an history step');
    });

    casper.forward();
    casper.then(function(self) {
        t.comment('navigating history forward');
        t.assertMatch(self.getCurrentUrl(), /tests\/site\/page3\.html$/, 'Casper.forward() can go forward an history step');
    });

    casper.run(function(self) {
        t.assert(self.history.length > 0, 'Casper.history contains urls');
        t.assertMatch(self.history[0], /tests\/site\/page1\.html$/, 'Casper.history has the correct first url');
        t.done();
    });
})(casper.test);
