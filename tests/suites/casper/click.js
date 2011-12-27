(function(t) {
    casper.start('tests/site/index.html', function(self) {
        self.click('a[href="test.html"]');
    });

    casper.then(function(self) {
        t.comment('Casper.click()');
        t.assertTitle('CasperJS test target', 'Casper.click() can click on a link');
    }).thenClick('a', function(self) {
        t.comment('Casper.thenClick()');
        t.assertTitle('CasperJS test form', 'Casper.thenClick() can click on a link');
    });

    // onclick variants tests
    casper.thenOpen('tests/site/click.html', function(self) {
        t.comment('CasperUtils.click()');
        self.test.assert(self.click('#test1'), 'CasperUtils.click() can click an `href="javascript:` link');
        self.test.assert(self.click('#test2'), 'CasperUtils.click() can click an `href="#"` link');
        self.test.assert(!self.click('#test3'), 'CasperUtils.click() can click an `onclick=".*; return false"` link');
        self.test.assert(!self.click('#test4'), 'CasperUtils.click() can click an unobstrusive js handled link');
        var results = self.getGlobal('results');
        self.test.assert(results.test1, 'CasperUtils.click() has clicked an `href="javascript:` link');
        self.test.assert(results.test2, 'CasperUtils.click() has clicked an `href="#"` link');
        self.test.assert(results.test3, 'CasperUtils.click() has clicked an `onclick=".*; return false"` link');
        self.test.assert(results.test4, 'CasperUtils.click() has clicked an unobstrusive js handled link');
    });

    casper.run(function(self) {
        t.done();
    });
})(casper.test);