var fs = require('fs'), testFile = '/tmp/__casper_test_capture.png';

if (fs.exists(testFile) && fs.isFile(testFile)) {
    fs.remove(testFile);
}

casper.start('tests/site/index.html', function(self) {
    self.viewport(300, 200);
    this.test.comment('Casper.capture()');
    self.capture(testFile);
    this.test.assert(fs.isFile(testFile), 'Casper.capture() captured a screenshot');
});

try {
    fs.remove(testFile);
} catch(e) {}

casper.run(function(self) {
    this.test.done();
});
