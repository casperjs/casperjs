if (!phantom.casperLoaded) {
    console.log('This script must be invoked using the casperjs executable');
    phantom.exit(1);
}

var fs = require('fs');
var utils = require('utils');
var f = utils.format;
var casper = require('casper').create({
    faultTolerant: false
});

// Options from cli
casper.options.verbose = casper.cli.get('direct') || false;
casper.options.logLevel = casper.cli.get('log-level') || "error";

// Overriding Casper.open to prefix all test urls
casper.setFilter('open.location', function(location) {
    if (!/^http/.test(location)) {
        return f('file://%s/%s', phantom.casperPath, location);
    }
    return location;
});

var tests = [];

if (casper.cli.args.length) {
    tests = casper.cli.args.filter(function(path) {
        return fs.isFile(path) || fs.isDirectory(path);
    });
} else {
    casper.echo('No test path passed, exiting.', 'RED_BAR', 80);
    casper.exit(1);
}

casper.test.on('tests.complete', function() {
    this.renderResults(true, undefined, casper.cli.get('xunit') || undefined);
});

casper.test.runSuites.apply(casper.test, tests);
