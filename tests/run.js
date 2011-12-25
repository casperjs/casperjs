if (!phantom.casperLoaded) {
    console.log('This script must be invoked using the casperjs executable');
    phantom.exit(1);
}

var fs = require('fs');
var utils = require('utils');

// Overriding Casper.open to prefix all test urls
require('casper').Casper.extend({
    open: function(location, options) {
        options = utils.isType(options, "object") ? options : {};
        this.requestUrl = location;
        var url = 'file://' + phantom.casperPath + '/' + location;
        this.page.open(url);
        return this;
    }
});

var casper = require('casper').create({
    faultTolerant: false,
    verbose:       true
});

(function(casper) {
    var tests = [];
    if (casper.cli.args.length) {
        tests = casper.cli.args.filter(function(path) {
            return fs.isFile(path) || fs.isDirectory(path);
        });
    }
    if (!tests.length) {
        // default test suite is casperjs' one
        tests = [fs.absolute(fs.pathJoin(phantom.casperPath, 'tests', 'suites'))];
    }
    casper.test.runSuites.apply(casper.test, tests);
})(casper);
