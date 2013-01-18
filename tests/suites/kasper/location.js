/*jshint strict:false*/
/*global kasperError kasper console phantom require*/
var utils = require('utils')

if (utils.ltVersion(phantom.version, '1.8.0')) {
    // https://github.com/n1k0/kasperjs/issues/101
    kasper.warn('document.location is broken under phantomjs < 1.8');
    kasper.test.done();
} else {
    kasper.test.begin('document.location tests', 1, function(test) {
        kasper.start('tests/site/index.html', function() {
            this.evaluate(function() {
                document.location = '/tests/site/form.html';
            });
        });
        kasper.then(function() {
            test.assertUrlMatches(/form\.html$/, 'document.location works as expected');
        });
        kasper.run(function() {
            test.done();
        });
    });
}
