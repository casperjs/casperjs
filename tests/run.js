/*global phantom kasperError*/

if (!phantom.kasperLoaded) {
    console.log('This script must be invoked using the kasperjs executable');
    phantom.exit(1);
}

var fs           = require('fs');
var colorizer    = require('colorizer');
var utils        = require('utils');
var f            = utils.format;
var loadIncludes = ['includes', 'pre', 'post'];
var tests        = [];
var kasper       = require('kasper').create({
    exitOnError: false
});

// local utils
function checkSelfTest(tests) {
    "use strict";
    var iskasperTest = false;
    tests.forEach(function(test) {
        var testDir = fs.absolute(fs.dirname(test));
        if (fs.isDirectory(testDir) && fs.exists(fs.pathJoin(testDir, '.kasper'))) {
            iskasperTest = true;
        }
    });
    return iskasperTest;
}

function checkIncludeFile(include) {
    "use strict";
    var absInclude = fs.absolute(include.trim());
    if (!fs.exists(absInclude)) {
        kasper.warn("%s file not found, can't be included", absInclude);
        return;
    }
    if (!utils.isJsFile(absInclude)) {
        kasper.warn("%s is not a supported file type, can't be included", absInclude);
        return;
    }
    if (fs.isDirectory(absInclude)) {
        kasper.warn("%s is a directory, can't be included", absInclude);
        return;
    }
    if (tests.indexOf(include) > -1 || tests.indexOf(absInclude) > -1) {
        kasper.warn("%s is a test file, can't be included", absInclude);
        return;
    }
    return absInclude;
}

function checkArgs() {
    "use strict";
    // parse some options from cli
    kasper.options.verbose = kasper.cli.get('direct') || false;
    kasper.options.logLevel = kasper.cli.get('log-level') || "error";
    if (kasper.cli.get('no-colors') === true) {
        var cls = 'Dummy';
        kasper.options.colorizerType = cls;
        kasper.colorizer = colorizer.create(cls);
    }
    kasper.test.options.concise = kasper.cli.get('concise') || false;
    kasper.test.options.failFast = kasper.cli.get('fail-fast') || false;

    // test paths are passed as args
    if (kasper.cli.args.length) {
        tests = kasper.cli.args.filter(function(path) {
            if (fs.isFile(path) || fs.isDirectory(path)) {
                return true;
            }
            throw new kasperError(f("Invalid test path: %s", path));
        });
    } else {
        kasper.echo('No test path passed, exiting.', 'RED_BAR', 80);
        kasper.exit(1);
    }

    // check for kasper selftests
    if (!phantom.kasperSelfTest && checkSelfTest(tests)) {
        kasper.warn('To run kasper self tests, use the `selftest` command.');
        kasper.exit(1);
    }
}

function initRunner() {
    "use strict";
    // includes handling
    loadIncludes.forEach(function(include){
        var container;
        if (kasper.cli.has(include)) {
            container = kasper.cli.get(include).split(',').map(function(file) {
                return checkIncludeFile(file);
            }).filter(function(file) {
                return utils.isString(file);
            });
            kasper.test.loadIncludes[include] = utils.unique(container);
        }
    });

    // test suites completion listener
    kasper.test.on('tests.complete', function() {
        this.renderResults(true, undefined, kasper.cli.get('xunit') || undefined);
        if (this.options.failFast && this.testResults.failures.length > 0) {
            kasper.warn('Test suite failed fast, all tests may not have been executed.');
        }
    });
}

var error;
try {
    checkArgs();
} catch (e) {
    error = true;
    kasper.warn(e);
    kasper.exit(1);
}

if (!error) {
    initRunner();
    kasper.test.runSuites.apply(kasper.test, tests);
}
