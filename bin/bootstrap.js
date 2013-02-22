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

/*global console phantom require*/
/*jshint maxstatements:30 maxcomplexity:10*/

if (!phantom) {
    console.error('CasperJS needs to be executed in a PhantomJS environment http://phantomjs.org/');
}

if (phantom.version.major === 1 && phantom.version.minor < 7) {
    console.error('CasperJS needs at least PhantomJS v1.7 or later.');
    phantom.exit(1);
} else {
    try {
        bootstrap(window);
    } catch (e) {
        console.error(e);
        (e.stackArray || []).forEach(function(entry) {
            console.error('  In ' + entry.sourceURL + ':' + entry.line);
        });
        phantom.exit(1);
    }
}

// Polyfills
if (typeof Function.prototype.bind !== "function") {
    Function.prototype.bind = function(scope) {
        "use strict";
        var _function = this;
        return function() {
            return _function.apply(scope, arguments);
        };
    };
}

/**
 * CasperJS ships with its own implementation of CommonJS' require() because
 * PhantomJS' native one doesn't allow to specify supplementary, alternative
 * lookup directories to fetch modules from.
 *
 */
function patchRequire(require) {
    "use strict";
    require = require || window.require;
    if (require.patched) {
        return require;
    }
    var patchedRequire = function _require(path) {
        var fs = require('fs');
        var moduleFilePath = fs.pathJoin(phantom.casperPath, 'modules', path + '.js');
        if (!fs.exists(moduleFilePath)) {
            return require(path); // native phantomjs' require() behavior
        }
        try {
            return require(moduleFilePath);
        } catch (e) {
            var error = new window.CasperError('__mod_error(' + path + ':' + e.line + '):: ' + e);
            error.file = moduleFilePath;
            error.line = e.line;
            error.stack = e.stack;
            error.stackArray = JSON.parse(JSON.stringify(e.stackArray));
            if (error.stackArray.length > 0) {
                error.stackArray[0].sourceURL = moduleFilePath;
            }
            throw error;
        }
    };
    patchedRequire.cache = require.cache;
    patchedRequire.patched = true;
    return patchedRequire;
}

function bootstrap(global) {
    "use strict";
    var phantomArgs = require('system').args;

    /**
     * Hooks in default phantomjs error handler to print a hint when a possible
     * casperjs command misuse is detected.
     *
     */
    phantom.onError = function onPhantomError(msg, trace) {
        phantom.defaultErrorHandler.apply(phantom, arguments);
        if (msg.indexOf("ReferenceError: Can't find variable: casper") === 0) {
            console.error('Hint: you may want to use the `casperjs test` command.');
        }
    };

    /**
     * Loads and initialize the CasperJS environment.
     */
    phantom.loadCasper = function loadCasper() {
        // Patching fs
        // TODO: watch for these methods being implemented in official fs module
        var fs = (function _fs(fs) {
            if (!fs.hasOwnProperty('basename')) {
                fs.basename = function basename(path) {
                    return path.replace(/.*\//, '');
                };
            }
            if (!fs.hasOwnProperty('dirname')) {
                fs.dirname = function dirname(path) {
                    return path.replace(/\\/g, '/').replace(/\/[^\/]*$/, '');
                };
            }
            if (!fs.hasOwnProperty('isWindows')) {
                fs.isWindows = function isWindows() {
                    var testPath = arguments[0] || this.workingDirectory;
                    return (/^[a-z]{1,2}:/i).test(testPath) || testPath.indexOf("\\\\") === 0;
                };
            }
            if (!fs.hasOwnProperty('pathJoin')) {
                fs.pathJoin = function pathJoin() {
                    return Array.prototype.join.call(arguments, this.separator);
                };
            }
            return fs;
        })(require('fs'));

        // casper root path
        if (!phantom.casperPath) {
            try {
                phantom.casperPath = phantom.args.map(function _map(i) {
                    var match = i.match(/^--casper-path=(.*)/);
                    if (match) {
                        return fs.absolute(match[1]);
                    }
                }).filter(function _filter(path) {
                    return fs.isDirectory(path);
                }).pop();
            } catch (e) {}
        }

        if (!phantom.casperPath) {
            console.error("Couldn't find nor compute phantom.casperPath, exiting.");
            phantom.exit(1);
        }

        // Embedded, up-to-date, validatable & controlable CoffeeScript
        phantom.injectJs(fs.pathJoin(phantom.casperPath, 'modules', 'vendors', 'coffee-script.js'));

        // custom global CasperError
        global.CasperError = function CasperError(msg) {
            Error.call(this);
            this.message = msg;
            this.name = 'CasperError';
        };

        // standard Error prototype inheritance
        global.CasperError.prototype = Object.getPrototypeOf(new Error());

        // CasperJS version, extracted from package.json - see http://semver.org/
        phantom.casperVersion = (function getVersion(path) {
            var parts, patchPart, pkg, pkgFile;
            var fs = require('fs');
            pkgFile = fs.absolute(fs.pathJoin(path, 'package.json'));
            if (!fs.exists(pkgFile)) {
                throw new global.CasperError('Cannot find package.json at ' + pkgFile);
            }
            try {
                pkg = JSON.parse(require('fs').read(pkgFile));
            } catch (e) {
                throw new global.CasperError('Cannot read package file contents: ' + e);
            }
            parts  = pkg.version.trim().split(".");
            if (parts.length < 3) {
                throw new global.CasperError("Invalid version number");
            }
            patchPart = parts[2].split('-');
            return {
                major: ~~parts[0]       || 0,
                minor: ~~parts[1]       || 0,
                patch: ~~patchPart[0]   || 0,
                ident: patchPart[1]     || "",
                toString: function toString() {
                    var version = [this.major, this.minor, this.patch].join('.');
                    if (this.ident) {
                        version = [version, this.ident].join('-');
                    }
                    return version;
                }
            };
        })(phantom.casperPath);

        // patch require (must be called in every casperjs module as of 1.1)
        global.require = patchRequire(global.require);

        // casper cli args
        phantom.casperArgs = global.require('cli').parse(phantom.args);

        // loaded status
        phantom.casperLoaded = true;
    };

    /**
     * Initializes the CasperJS Command Line Interface.
     */
    phantom.initCasperCli = function initCasperCli() {
        var fs = require("fs");
        var baseTestsPath = fs.pathJoin(phantom.casperPath, 'tests');

        if (!!phantom.casperArgs.options.version) {
            console.log(phantom.casperVersion.toString());
            return phantom.exit();
        } else if (phantom.casperArgs.get(0) === "test") {
            phantom.casperScript = fs.absolute(fs.pathJoin(baseTestsPath, 'run.js'));
            phantom.casperTest = true;
            phantom.casperArgs.drop("test");
        } else if (phantom.casperArgs.get(0) === "selftest") {
            phantom.casperScript = fs.absolute(fs.pathJoin(baseTestsPath, 'run.js'));
            phantom.casperSelfTest = phantom.casperTest = true;
            phantom.casperArgs.options.includes = fs.pathJoin(baseTestsPath, 'selftest.js');
            if (phantom.casperArgs.args.length <= 1) {
                phantom.casperArgs.args.push(fs.pathJoin(baseTestsPath, 'suites'));
            }
            phantom.casperArgs.drop("selftest");
        } else if (phantom.casperArgs.args.length === 0 || !!phantom.casperArgs.options.help) {
            var phantomVersion = [phantom.version.major, phantom.version.minor, phantom.version.patch].join('.');
            var f = require("utils").format;
            console.log(f('CasperJS version %s at %s, using PhantomJS version %s',
                        phantom.casperVersion.toString(),
                        phantom.casperPath, phantomVersion));
            console.log(fs.read(fs.pathJoin(phantom.casperPath, 'bin', 'usage.txt')));
            return phantom.exit(0);
        }

        if (!phantom.casperScript) {
            phantom.casperScript = phantom.casperArgs.get(0);
        }

        if (!fs.isFile(phantom.casperScript)) {
            console.error('Unable to open file: ' + phantom.casperScript);
            return phantom.exit(1);
        }

        // filter out the called script name from casper args
        phantom.casperArgs.drop(phantom.casperScript);

        // passed casperjs script execution
        var injected = false;
        try {
            injected = phantom.injectJs(phantom.casperScript);
        } catch (e) {
            throw new global.CasperError('Error loading script ' + phantom.casperScript + ': ' + e);
        }
        if (!injected) {
            throw new global.CasperError('Unable to load script ' + phantom.casperScript + '; check file syntax');
        }
    };

    if (!phantom.casperLoaded) {
        phantom.loadCasper();
    }

    if (true === phantom.casperArgs.get('cli')) {
        phantom.initCasperCli();
    }
}
