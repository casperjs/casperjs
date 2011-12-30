(function(t) {
    casper.start('tests/site/index.html', function(self) {
        self.mouseClick('a[href="test.html"]');
    });

    casper.then(function(self) {
        t.comment('Casper.mouseClick()');
        t.assertTitle('CasperJS test target', 'Casper.mouseClick() can click on a link');
    });

    // onclick variants tests
    casper.thenOpen('tests/site/click.html', function(self) {
        t.comment('Casper.mouseClick()');
        self.mouseClick('#test1');
        self.mouseClick('#test2');
        self.mouseClick('#test3');
        self.mouseClick('#test4');
        var results = self.getGlobal('results');
        self.test.assert(results.test1, 'Casper.mouseClick() has clicked an `href="javascript:` link');
        self.test.assert(results.test2, 'Casper.mouseClick() has clicked an `href="#"` link');
        self.test.assert(results.test3, 'Casper.mouseClick() has clicked an `onclick=".*; return false"` link');
        self.test.assert(results.test4, 'Casper.mouseClick() has clicked an unobstrusive js handled link');
    });

    casper.run(function(self) {
        t.done();
    });
})(casper.test);