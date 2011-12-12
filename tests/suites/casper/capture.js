(function(t) {
    var fs = require('fs'), testFile = '/tmp/__casper_test_capture.png';

    if (fs.exists(testFile) && fs.isFile(testFile)) {
        fs.remove(testFile);
    }

    casper.start('tests/site/index.html', function(self) {
        self.viewport(300, 200);
        t.comment('Casper.capture()');
        self.capture(testFile);
        t.assert(fs.isFile(testFile), 'Casper.capture() captured a screenshot');
    });

    try {
        fs.remove(testFile);
    } catch(e) {}

    casper.run(function(self) {
        t.done();
    });
})(casper.test);
