/*global kasper*/
/*jshint strict:false*/
var fs = require('fs');

kasper.test.begin('base64encode() and download() tests', 2, function(test) {
    // FIXME: https://github.com/ariya/phantomjs/pull/364 has been merged, update scheme
    kasper.start('file://' + phantom.kasperPath + '/tests/site/index.html', function() {
        var imageUrl = 'file://' + phantom.kasperPath + '/tests/site/images/phantom.png',
            image = this.base64encode(imageUrl);
        test.assertEquals(image.length, 6160, 'kasper.base64encode() can retrieve base64 contents');
        this.download(imageUrl, '__test_logo.png');
        test.assert(fs.exists('__test_logo.png'), 'kasper.download() downloads a file');
        if (fs.exists('__test_logo.png')) {
            fs.remove('__test_logo.png');
        }
    }).run(function() {
        test.done();
    });
});
