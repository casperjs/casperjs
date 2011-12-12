(function(t) {
    t.comment('Casper.base64encode()');

    casper.start('tests/site/index.html', function(self) {
        var image = self.base64encode('file://' + phantom.libraryPath + '/site/images/phantom.png');
        t.assertEquals(image.length, 6160, 'Casper.base64encode() can retrieve base64 contents');
    });

    casper.run(function(self) {
        t.done();
    });
})(casper.test);