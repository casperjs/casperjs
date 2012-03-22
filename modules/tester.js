/*!
 * Casper is a navigation utility for PhantomJS.
 *
 * Documentation: http://casperjs.org/
 * Repository:    http://github.com/n1k0/casperjs
 *
 * Copyright (c) 2011-2012 Nicolas Perriault
 *
 * Part of source code is Copyright Joyent, Inc. and other Node contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

var fs = require('fs');
var events = require('events');
var utils = require('utils');
var f = utils.format;

exports.create = function(casper, options) {
    return new Tester(casper, options);
};

/**
 * Casper tester: makes assertions, stores test results and display then.
 *
 */
var Tester = function(casper, options) {
    if (!utils.isCasperObject(casper)) {
        throw new CasperError("Tester needs a Casper instance");
    }

    this.currentTestFile = null;
    this.exporter = require('xunit').create();
    this.running = false;
    this.suites = [];
    this.options = utils.mergeObjects({
        failText: "FAIL", // text to use for a successful test
        passText: "PASS", // text to use for a failed test
        pad:      80      // maximum number of chars for a result line
    }, options);

    // properties
    this.testResults = {
        passed: 0,
        failed: 0,
        failures: []
    };

    // events
    casper.on('step.error', function(e) {
        casper.test.fail(e);
        casper.test.done();
    });

    this.on('success', function(success) {
        this.exporter.addSuccess(fs.absolute(success.file), success.message);
    });

    this.on('fail', function(failure) {
        this.exporter.addFailure(fs.absolute(failure.file), failure.message, failure.details || "test failed", failure.type || "unknown");
        this.testResults.failures.push(failure);
    });

    // methods
    /**
     * Asserts that a condition strictly resolves to true.
     *
     * @param  Boolean  subject
     * @param  String   message  Test description
     */
    this.assert = function assert(subject, message) {
        var status = this.options.passText, eventName;
        if (subject === true) {
            eventName = 'success';
            style = 'INFO';
            this.testResults.passed++;
        } else {
            eventName = 'fail';
            status = this.options.failText;
            style = 'RED_BAR';
            this.testResults.failed++;
        }
        this.emit(eventName, {
            type:    "assert",
            details: "test failed",
            message: message,
            file:    this.currentTestFile,
            values:  {
                subject: subject
            }
        });
        casper.echo([this.colorize(status, style), this.formatMessage(message)].join(' '));
    };

    /**
     * Asserts that two values are strictly equals.
     *
     * @param  Mixed   subject    The value to test
     * @param  Mixed   expected   The expected value
     * @param  String  message    Test description
     */
    this.assertEquals = function assertEquals(subject, expected, message) {
        var eventName;
        if (this.testEquals(subject, expected)) {
            eventName = "success";
            casper.echo(this.colorize(this.options.passText, 'INFO') + ' ' + this.formatMessage(message));
            this.testResults.passed++;
        } else {
            eventName = "fail";
            casper.echo(this.colorize(this.options.failText, 'RED_BAR') + ' ' + this.formatMessage(message, 'WARNING'));
            this.comment('   got:      ' + utils.serialize(subject));
            this.comment('   expected: ' + utils.serialize(expected));
            this.testResults.failed++;
        }
        this.emit(eventName, {
            type:   "assertEquals",
            message: message,
            details: f("test failed; expected: %s; got: %s", expected, subject),
            file:    this.currentTestFile,
            values:  {
                subject:  subject,
                expected: expected
            }
        });
    };

    /**
     * Asserts that a code evaluation in remote DOM resolves to true.
     *
     * @param  Function  fn         A function to be evaluated in remote DOM
     * @param  String    message    Test description
     * @param  Object    context    Object containing the parameters to inject into the function (optional)
     */
    this.assertEval = function assertEval(fn, message, context) {
        return this.assert(casper.evaluate(fn, context), message);
    };

    /**
     * Asserts that the result of a code evaluation in remote DOM equals
     * an expected value.
     *
     * @param  Function fn         The function to be evaluated in remote DOM
     * @param  Boolean  expected   The expected value
     * @param  String   message    Test description
     * @param  Object   context    Object containing the parameters to inject into the function (optional)
     */
    this.assertEvalEquals = function assertEvalEquals(fn, expected, message, context) {
        return this.assertEquals(casper.evaluate(fn, context), expected, message);
    };

    /**
     * Asserts that an element matching the provided CSS3 selector exists in
     * remote DOM.
     *
     * @param  String   selector   CSS3 selector
     * @param  String   message    Test description
     */
    this.assertExists = function assertExists(selector, message) {
        return this.assert(casper.exists(selector), message);
    };

    /**
     * Asserts that current HTTP status is the one passed as argument.
     *
     * @param  Number  status   HTTP status code
     * @param  String  message  Test description
     */
    this.assertHttpStatus = function assertHttpStatus(status, message) {
        return this.assertEquals(casper.currentHTTPStatus, status, message || f("HTTP status code is %d", status));
    };

    /**
     * Asserts that a provided string matches a provided RegExp pattern.
     *
     * @param  String   subject    The string to test
     * @param  RegExp   pattern    A RegExp object instance
     * @param  String   message    Test description
     */
    this.assertMatch = function assertMatch(subject, pattern, message) {
        var eventName;
        if (pattern.test(subject)) {
            eventName = "success";
            casper.echo(this.colorize(this.options.passText, 'INFO') + ' ' + this.formatMessage(message));
            this.testResults.passed++;
        } else {
            eventName = "fail";
            casper.echo(this.colorize(this.options.failText, 'RED_BAR') + ' ' + this.formatMessage(message, 'WARNING'));
            this.comment('   subject: ' + subject);
            this.comment('   pattern: ' + pattern.toString());
            this.testResults.failed++;
        }
        this.emit(eventName, {
            type:   "assertMatch",
            message: message,
            details: f("test failed; subject: %s; pattern: %s", subject, pattern.toString()),
            file:    this.currentTestFile,
            values:  {
                subject: subject,
                pattern: pattern
            }
        });
    };

    /**
     * Asserts a condition resolves to false.
     *
     * @param  Boolean  condition
     * @param  String   message    Test description
     */
    this.assertNot = function assertNot(condition, message) {
        return this.assert(!condition, message);
    };

    /**
     * Asserts that the provided function called with the given parameters
     * will raise an exception.
     *
     * @param  Function  fn       The function to test
     * @param  Array     args     The arguments to pass to the function
     * @param  String    message  Test description
     */
    this.assertRaises = function assertRaises(fn, args, message) {
        try {
            fn.apply(null, args);
            this.fail(message);
        } catch (e) {
            this.pass(message);
        }
    };

    /**
     * Asserts that the current page has a resource that matches the provided test
     *
     * @param Function/String  test      A test function that is called with every response
     * @param  String   message    Test description
     */
    this.assertResourceExists = function assertResourceExists(test, message) {
        return this.assert(casper.resourceExists(test), message);
    };

    /**
     * Asserts that at least an element matching the provided CSS3 selector
     * exists in remote DOM.
     *
     * @param  String   selector   A CSS3 selector string
     * @param  String   message    Test description
     */
    this.assertSelectorExists = function assertSelectorExists(selector, message) {
        return this.assert(this.exists(selector), message);
    };

    /**
     * Asserts that given text exits in the document body.
     *
     * @param  String   text       Text to be found
     * @param  String   message    Test description
     */
    this.assertTextExists = function assertTextExists(text, message) {
        return this.assert((casper.evaluate(function() {
            return document.body.innerText;
        }).indexOf(text) != -1), message);
    };

    /**
     * Asserts that title of the remote page equals to the expected one.
     *
     * @param  String  expected   The expected title string
     * @param  String  message    Test description
     */
    this.assertTitle = function assertTitle(expected, message) {
        return this.assertEquals(casper.getTitle(), expected, message);
    };

    /**
     * Asserts that the provided input is of the given type.
     *
     * @param  mixed   input    The value to test
     * @param  String  type     The javascript type name
     * @param  String  message  Test description
     */
    this.assertType = function assertType(input, type, message) {
        return this.assertEquals(utils.betterTypeOf(input), type, message);
    };

    /**
     * Asserts that a the current page url matches the provided RegExp
     * pattern.
     *
     * @param  RegExp   pattern    A RegExp object instance
     * @param  String   message    Test description
     */
    this.assertUrlMatch = function assertUrlMatch(pattern, message) {
        return this.assertMatch(casper.getCurrentUrl(), pattern, message);
    };

    this.bar = function bar(text, style) {
        casper.echo(text, style, this.options.pad);
    };

    /**
     * Render a colorized output. Basically a proxy method for
     * Casper.Colorizer#colorize()
     */
    this.colorize = function colorize(message, style) {
        return casper.colorizer.colorize(message, style);
    };

    /**
     * Writes a comment-style formatted message to stdout.
     *
     * @param  String  message
     */
    this.comment = function comment(message) {
        casper.echo('# ' + message, 'COMMENT');
    };

    /**
     * Declares the current test suite done.
     *
     */
    this.done = function done() {
        this.running = false;
    };

    /**
     * Writes an error-style formatted message to stdout.
     *
     * @param  String  message
     */
    this.error = function error(message) {
        casper.echo(message, 'ERROR');
    };

    /**
     * Executes a file, wraping and evaluating its code in an isolated
     * environment where only the current `casper` instance is passed.
     *
     * @param  String  file  Absolute path to some js/coffee file
     */
    this.exec = function exec(file) {
        file = this.filter('exec.file', file) || file;
        if (!fs.isFile(file) || !utils.isJsFile(file)) {
            var e = new CasperError(f("Cannot exec %s: can only exec() files with .js or .coffee extensions", file));
            e.fileName = file;
            throw e;
        }
        this.currentTestFile = file;
        try {
            new Function('casper', phantom.getScriptCode(file))(casper);
        } catch (e) {
            var self = this;
            phantom.processScriptError(e, file, function(error) {
                // do not abort the whole suite, just fail fast displaying the
                // caught error and process next suite
                self.fail(e);
                self.done();
            });
        }
    };

    /**
     * Adds a failed test entry to the stack.
     *
     * @param  String  message
     */
    this.fail = function fail(message) {
        this.assert(false, message);
    };

    /**
     * Recursively finds all test files contained in a given directory.
     *
     * @param  String  dir  Path to some directory to scan
     */
    this.findTestFiles = function findTestFiles(dir) {
        var self = this;
        if (!fs.isDirectory(dir)) {
            return [];
        }
        var entries = fs.list(dir).filter(function(entry) {
            return entry !== '.' && entry !== '..';
        }).map(function(entry) {
            return fs.absolute(fs.pathJoin(dir, entry));
        });
        entries.forEach(function(entry) {
            if (fs.isDirectory(entry)) {
                entries = entries.concat(self.findTestFiles(entry));
            }
        });
        return entries.filter(function(entry) {
            return utils.isJsFile(fs.absolute(fs.pathJoin(dir, entry)));
        }).sort();
    };

    /**
     * Formats a message to highlight some parts of it.
     *
     * @param  String  message
     * @param  String  style
     */
    this.formatMessage = function formatMessage(message, style) {
        var parts = /([a-z0-9_\.]+\(\))(.*)/i.exec(message);
        if (!parts) {
            return message;
        }
        return this.colorize(parts[1], 'PARAMETER') + this.colorize(parts[2], style);
    };

    /**
     * Writes an info-style formatted message to stdout.
     *
     * @param  String  message
     */
    this.info = function info(message) {
        casper.echo(message, 'PARAMETER');
    };

    /**
     * Adds a successful test entry to the stack.
     *
     * @param  String  message
     */
    this.pass = function pass(message) {
        this.assert(true, message);
    };

    /**
     * Renders a detailed report for each failed test.
     *
     * @param  Array  failures
     */
    this.renderFailureDetails = function renderFailureDetails(failures) {
        if (failures.length === 0) {
            return;
        }
        casper.echo(f("\nDetails for the %d failed test%s:\n", failures.length, failures.length > 1 ? "s" : ""), "PARAMETER");
        failures.forEach(function(failure) {
            var message, line;
            if (utils.isType(failure.message, "object") && failure.message.stack) {
                line = failure.message.line ? failure.message.line : 0;
                message = failure.message.stack;
            } else {
                line = 0;
                message = failure.message;
            }
            casper.echo(f('In %s:%d', failure.file, line));
            casper.echo(f('    %s', message), "COMMENT");
        });
    };

    /**
     * Render tests results, an optionnaly exit phantomjs.
     *
     * @param  Boolean  exit
     */
    this.renderResults = function renderResults(exit, status, save) {
        save = utils.isString(save) ? save : this.options.save;
        var total = this.testResults.passed + this.testResults.failed, statusText, style, result;
        var exitStatus = ~~(status || (this.testResults.failed > 0 ? 1 : 0));
        if (total === 0) {
            statusText = this.options.failText;
            style = 'RED_BAR';
            result = f("%s Looks like you didn't run any test.", statusText);
        } else {
            if (this.testResults.failed > 0) {
                statusText = this.options.failText;
                style = 'RED_BAR';
            } else {
                statusText = this.options.passText;
                style = 'GREEN_BAR';
            }
            result = f('%s %s tests executed, %d passed, %d failed.',
                       statusText, total, this.testResults.passed, this.testResults.failed);
        }
        casper.echo(result, style, this.options.pad);
        if (this.testResults.failed > 0) {
            this.renderFailureDetails(this.testResults.failures);
        }
        if (save && utils.isFunction(require)) {
            try {
                fs.write(save, this.exporter.getXML(), 'w');
                casper.echo(f('Result log stored in %s', save), 'INFO', 80);
            } catch (e) {
                casper.echo(f('Unable to write results to %s: %s', save, e), 'ERROR', 80);
            }
        }
        if (exit === true) {
            casper.exit(exitStatus);
        }
    };

    /**
     * Runs al suites contained in the paths passed as arguments.
     *
     */
    this.runSuites = function runSuites() {
        var testFiles = [], self = this;
        if (arguments.length === 0) {
            throw new CasperError("runSuites() needs at least one path argument");
        }
        Array.prototype.forEach.call(arguments, function(path) {
            if (!fs.exists(path)) {
                self.bar(f("Path %s doesn't exist", path), "RED_BAR");
            }
            if (fs.isDirectory(path)) {
                testFiles = testFiles.concat(self.findTestFiles(path));
            } else if (fs.isFile(path)) {
                testFiles.push(path);
            }
        });
        if (testFiles.length === 0) {
            this.bar(f("No test file found in %s, aborting.", Array.prototype.slice.call(arguments)), "RED_BAR");
            casper.exit(1);
        }
        var current = 0;
        var interval = setInterval(function(self) {
            if (self.running) {
                return;
            }
            if (current === testFiles.length) {
                self.emit('tests.complete');
                clearInterval(interval);
            } else {
                self.runTest(testFiles[current]);
                current++;
            }
        }, 100, this);
    };

    /**
     * Runs a test file
     *
     */
    this.runTest = function runTest(testFile) {
        this.bar(f('Test file: %s', testFile), 'INFO_BAR');
        this.running = true; // this.running is set back to false with done()
        try {
            this.exec(testFile);
        } catch (e) {
            this.fail(e);
            this.done();
        }
    };

    /**
     * Tests equality between the two passed arguments.
     *
     * @param  Mixed  v1
     * @param  Mixed  v2
     * @param  Boolean
     */
    this.testEquals = function testEquals(v1, v2) {
        if (utils.betterTypeOf(v1) !== utils.betterTypeOf(v2)) {
            return false;
        }
        if (utils.isFunction(v1)) {
            return v1.toString() === v2.toString();
        }
        if (v1 instanceof Object && v2 instanceof Object) {
            if (Object.keys(v1).length !== Object.keys(v2).length) {
                return false;
            }
            for (var k in v1) {
                if (!this.testEquals(v1[k], v2[k])) {
                    return false;
                }
            }
            return true;
        }
        return v1 === v2;
    };
};

// Tester class is an EventEmitter
utils.inherits(Tester, events.EventEmitter);

exports.Tester = Tester;
