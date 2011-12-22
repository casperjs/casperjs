(function(t) {
    casper.start('tests/site/index.html', function(self) {
        var imageUrl = 'file://' + phantom.casperPath + '/tests/site/images/phantom.png';
        var image = self.base64encode(imageUrl);
        var fs = require('fs');

        t.comment('Casper.base64encode()');
        t.assertEquals(image.length, 6160, 'Casper.base64encode() can retrieve base64 contents');

        t.comment('Casper.download()');
        self.download(imageUrl, 'logo.png');
        t.assert(fs.exists('logo.png'), 'Casper.download() downloads a file');
        if (fs.exists('logo.png')) {
            fs.remove('logo.png');
        }
    });

    casper.run(function(self) {
        t.done();
    });
})(casper.test);
