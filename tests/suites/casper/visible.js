(function(t) {
    casper.start('tests/site/visible.html', function(self) {
        self.test.comment('Casper.visible()');
        self.test.assert(self.visible('#img1'), 'Casper.visible() can detect if an element is visible');
        self.test.assert(!self.visible('#img2'), 'Casper.visible() can detect if an element is invisible');
        self.test.assert(!self.visible('#img3'), 'Casper.visible() can detect if an element is invisible');
        self.waitWhileVisible('#img1', function(self) {
            self.test.comment('Casper.waitWhileVisible()');
            self.test.pass('Casper.waitWhileVisible() can wait while an element is visible');
        }, function(self) {
            self.test.comment('Casper.waitWhileVisible()');
            self.test.fail('Casper.waitWhileVisible() can wait while an element is visible');
        }, 2000);
    });

    casper.run(function(self) {
        t.done();
    });
})(casper.test);
