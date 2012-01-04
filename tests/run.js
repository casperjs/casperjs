if (!phantom.casperLoaded) {
    console.log('This script must be invoked using the casperjs executable');
    phantom.exit(1);
}

var fs = require('fs');
var utils = require('utils');
var casper = require('casper').create({
    faultTolerant: false
});

// Overriding Casper.open to prefix all test urls
casper.setFilter('open.location', function(location) {
    return 'file://' + phantom.casperPath + '/' + location;
});

var tests = [];

if (casper.cli.args.length) {
    tests = casper.cli.args.filter(function(path) {
        return fs.isFile(path) || fs.isDirectory(path);
    });
}

if (!tests.length) {
    if (casper.cli.args.length > 0) {
        casper.echo('No valid test path passed, exiting.', 'ERROR').exit(1);
    }
    // default test suite is casperjs' one
    casper.echo('Running complete CasperJS test suite', 'INFO');
    tests = [fs.absolute(fs.pathJoin(phantom.casperPath, 'tests', 'suites'))];
}

casper.test.runSuites.apply(casper.test, tests);
