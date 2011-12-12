(function(t) {
    t.comment('Casper.fetchText()');

    casper.start('tests/site/index.html', function(self) {
        t.assertEquals(self.fetchText('ul li'), 'onetwothree', 'Casper.fetchText() can retrieves text contents');
    });

    casper.run(function(self) {
        t.done();
    });
})(casper.test);
