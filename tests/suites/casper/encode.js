(function(t) {
    t.comment('Casper.base64encode()');

    casper.start('tests/site/index.html', function(self) {
        var imageUrl = 'file://' + phantom.casperPath + '/tests/site/images/phantom.png';
        var image = self.base64encode(imageUrl);
        t.assertEquals(image.length, 6160, 'Casper.base64encode() can retrieve base64 contents');
        self.download(imageUrl, 'logo.png');
        var fs = require('fs');
        t.assert(fs.exists('logo.png'), 'Casper.download() downloads a file');
    });

    casper.run(function(self) {
        t.done();
    });
})(casper.test);
