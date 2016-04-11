/*eslint strict:0*/
var fs = require('fs');

casper.test.begin('base64encode() and download() tests', 8, function(test) {
    // FIXME: https://github.com/ariya/phantomjs/pull/364 has been merged, update scheme
    casper.start('file://' + phantom.casperPath + '/tests/site/index.html', function() {
        var imageUrl = 'file://' + phantom.casperPath + '/tests/site/images/phantom.png',
            image = this.base64encode(imageUrl);
        test.assertEquals(image.length, 6160, 'Casper.base64encode() can retrieve base64 contents');
        this.download(imageUrl, '__test_logo.png');
        test.assert(fs.exists('__test_logo.png'), 'Casper.download() downloads a file');
        if (fs.exists('__test_logo.png')) {
            fs.remove('__test_logo.png');
        }
    })
    .then(function() {
        var csvFile = 'file://' + phantom.casperPath + '/tests/site/csv/base64encode.csv';
        this.download(csvFile, '__base64encode.csv');
        test.assert(fs.exists('__base64encode.csv'), 'Casper.download() downloads a file');

        var stream = fs.open('__base64encode.csv', 'r'),
        expectedValues = [
            'إختبار,',
            'آزمایشی,',
            '测试',
            'испытание',
            'परीकi'
        ],
        i = 0,
        lines = stream.read().split(/[\n]/);
        expectedValues.forEach(function(value) {
            test.assertEquals(lines[i], value, 'Casper.base64encode() can retrieve base64 complex strings');
            i++;
        });
        if (fs.exists('__base64encode.csv')) {
            fs.remove('__base64encode.csv');
        }
    }).run(function() {
        test.done();
    });
});
