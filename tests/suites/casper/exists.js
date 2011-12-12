(function(t) {
    t.comment('Casper.exists()');

    casper.start('tests/site/index.html', function(self) {
        t.assert(self.exists('a') && !self.exists('chucknorriz'), 'Casper.exists() can check if an element exists');
    });

    casper.run(function(step) {
        t.done();
    });
})(casper.test);
