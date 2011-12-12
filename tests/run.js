phantom.injectJs('casper.js');

var fs = require('fs');
var casper = new phantom.Casper({
    faultTolerant: false,
    verbose:       true
});

var tests = [];
if (phantom.args.length > 0) {
    // FIXME: leave room for other arguments than tests to be passed
    tests = phantom.args.map(function(path) {
        return pathJoin(fs.workingDirectory, path);
    });
} else {
    tests = [pathJoin(casperLibPath, '..', 'tests', 'suites')];
}

casper.test.runSuites.apply(casper.test, tests);