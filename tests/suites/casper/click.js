(function(t) {
    t.comment('Casper.click()');

    casper.start('tests/site/index.html', function(self) {
        self.click('a[href="test.html"]');
    });

    casper.then(function(self) {
        t.assertTitle('CasperJS test target', 'Casper.click() can click on a link');
    }).thenClick('a', function(self) {
        t.assertTitle('CasperJS test form', 'Casper.thenClick() can click on a link');
    });

    casper.run(function(self) {
        t.done();
    });
})(casper.test);
