//phantom.injectJs('casper.js');
phantom.injectJs('lib/vendors/esprima.js');

var fs = require('fs');
var casper = new phantom.Casper({
    faultTolerant: false,
    verbose:       true
});

var tests = [];
if (phantom.args.length > 2 && fs.isFile(phantom.args[2])) {
    tests = [phantom.args[2]];
} else {
    tests = [fs.absolute(pathJoin(casperLibPath, '..', 'tests', 'suites'))];
}

casper.test.runSuites.apply(casper.test, tests);