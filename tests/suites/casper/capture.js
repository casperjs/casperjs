/*global casper*/
/*jshint strict:false*/
var fs = require('fs'),
    testFile = '/tmp/__casper_test_capture.png';

if (fs.exists(testFile) && fs.isFile(testFile)) {
    fs.remove(testFile);
}

casper.test.begin('Casper.capture() tests', 1, function(test) {
    casper.start('tests/site/index.html', function() {
        this.viewport(300, 200);
        this.capture(testFile);
        test.assert(fs.isFile(testFile), 'Casper.capture() captured a screenshot');
    }).run(function() {
        try {
            fs.remove(testFile);
        } catch(e) {
            this.warn('Unable to delete test file ' + testFile + '; please delete it manually');
        }
        test.done();
    });
});

casper.test.begin('Casper.captureBase64() tests', 3, function(test) {
    casper.start('tests/site/index.html', function() {
        test.assert(this.captureBase64('png').length > 0,
                         'Casper.captureBase64() rendered a page capture as base64');
        test.assert(this.captureBase64('png', 'ul').length > 0,
                         'Casper.captureBase64() rendered a capture from a selector as base64');
        test.assert(this.captureBase64('png', {top: 0, left: 0, width: 30, height: 30}).length > 0,
                         'Casper.captureBase64() rendered a capture from a clipRect as base64');
    }).run(function() {
        test.done();
    });
});
