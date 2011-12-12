(function(t) {
    casper.start('tests/site/global.html', function(self) {
        t.comment('Casper.getGlobal()');
        t.assertEquals(self.getGlobal('myGlobal'), 'awesome string', 'Casper.getGlobal() can retrieve a remote global variable');
        t.assertRaises(self.getGlobal, ['myUnencodableGlobal'], 'Casper.getGlobal() does not fail trying to encode an unencodable global');
    });

    casper.run(function(self) {
        t.done();
    });
})(casper.test);
