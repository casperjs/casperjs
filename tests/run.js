if (!phantom.casperLoaded) {
    console.log('This script must be invoked using the casperjs executable');
    phantom.exit(1);
}

var fs       = require('fs');
var utils    = require('utils');
var f        = utils.format;
var includes = [];
var pre      = [];
var post     = [];
var tests    = [];
var casper   = require('casper').create({
    exitOnError: false
});

// local utils
function checkIncludeFile(include) {
    var absInclude = fs.absolute(include.trim());
    if (!fs.exists(absInclude)) {
        casper.warn("%s file not found, can't be included", absInclude);
        return;
    }
    if (!utils.isJsFile(absInclude)) {
        casper.warn("%s is not a supported file type, can't be included", absInclude);
        return;
    }
    if (fs.isDirectory(absInclude)) {
        casper.warn("%s is a directory, can't be included", absInclude);
        return;
    }
    if (tests.indexOf(include) > -1 || tests.indexOf(absInclude) > -1) {
        casper.warn("%s is a test file, can't be included", absInclude);
        return;
    }
    return absInclude;
}

// parse some options from cli
casper.options.verbose = casper.cli.get('direct') || false;
casper.options.logLevel = casper.cli.get('log-level') || "error";
if (casper.cli.get('no-colors')) {
    var cls = 'Dummy';
    casper.options.colorizerType = cls;
    casper.colorizer = colorizer.create(cls);
}

// test paths are passed as args
if (casper.cli.args.length) {
    tests = casper.cli.args.filter(function(path) {
        return fs.isFile(path) || fs.isDirectory(path);
    });
} else {
    casper.echo('No test path passed, exiting.', 'RED_BAR', 80);
    casper.exit(1);
}

// includes handling
if (casper.cli.has('includes')) {
    includes = casper.cli.get('includes').split(',').map(function(include) {
        // we can't use filter() directly because of abspath transformation
        return checkIncludeFile(include);
    }).filter(function(include) {
        return utils.isString(include);
    });
    casper.test.includes = utils.unique(includes);
}

// pre handling
if (casper.cli.has('pre')) {
    pre = casper.cli.get('pre').split(',').map(function(unique_pre) {
        // we can't use filter() directly because of abspath transformation
        return checkIncludeFile(unique_pre);
    }).filter(function(unique_pre) {
        return utils.isString(unique_pre);
    });
    casper.test.pre = utils.unique(pre);
}

// post handling
if (casper.cli.has('post')) {
    post = casper.cli.get('post').split(',').map(function(unique_post) {
        // we can't use filter() directly because of abspath transformation
        return checkIncludeFile(unique_post);
    }).filter(function(unique_post) {
        return utils.isString(unique_post);
    });
    casper.test.post = utils.unique(post);
}

// test suites completion listener
casper.test.on('tests.complete', function() {
    this.renderResults(true, undefined, casper.cli.get('xunit') || undefined);
});

// run all the suites
casper.test.runSuites.apply(casper.test, tests);
