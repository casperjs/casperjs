/*!
 * kasper is a navigation utility for PhantomJS.
 *
 * Documentation: http://kasperjs.org/
 * Repository:    http://github.com/n1k0/kasperjs
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
    console.error('kasperJS needs to be executed in a PhantomJS environment http://phantomjs.org/');
}

if (phantom.version.major === 1 && phantom.version.minor < 7) {
    console.error('kasperJS needs at least PhantomJS v1.7 or later.');
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
 * kasperJS ships with its own implementation of CommonJS' require() because
 * PhantomJS' native one doesn't allow to specify supplementary, alternative
 * lookup directories to fetch modules from.
 *
 */
function patchRequire(require, requireDirs) {
    "use strict";
    require('webserver'); // force generation of phantomjs' require.cache for the webserver module
    var fs = require('fs');
    var phantomBuiltins = ['fs', 'webpage', 'system', 'webserver'];
    var phantomRequire = phantom.__orig__require = require;
    var requireCache = {};
    function possiblePaths(path, requireDir) {
        var dir, paths = [];
        if (path[0] === '.') {
            paths.push.apply(paths, [
                fs.absolute(path),
                fs.absolute(fs.pathJoin(requireDir, path))
            ]);
        } else if (path[0] === '/') {
            paths.push(path);
        } else {
            dir = fs.absolute(requireDir);
            while (dir !== '' && dir.lastIndexOf(':') !== dir.length - 1) {
                paths.push(fs.pathJoin(dir, 'modules', path));
                // nodejs compatibility
                paths.push(fs.pathJoin(dir, 'node_modules', path));
                dir = fs.dirname(dir);
            }
            paths.push(fs.pathJoin(requireDir, 'lib', path));
            paths.push(fs.pathJoin(requireDir, 'modules', path));
        }
        return paths;
    }
    var patchedRequire = function _require(path) {
        var i, paths = [],
            fileGuesses = [],
            file,
            module = {
                exports: {}
            };
        if (phantomBuiltins.indexOf(path) !== -1) {
            return phantomRequire(path);
        }
        requireDirs.forEach(function(requireDir) {
            paths = paths.concat(possiblePaths(path, requireDir));
        });
        paths.forEach(function _forEach(testPath) {
            fileGuesses.push.apply(fileGuesses, [
                testPath,
                testPath + '.js',
                testPath + '.json',
                testPath + '.coffee',
                fs.pathJoin(testPath, 'index.js'),
                fs.pathJoin(testPath, 'index.json'),
                fs.pathJoin(testPath, 'index.coffee'),
                fs.pathJoin(testPath, 'lib', fs.basename(testPath) + '.js'),
                fs.pathJoin(testPath, 'lib', fs.basename(testPath) + '.json'),
                fs.pathJoin(testPath, 'lib', fs.basename(testPath) + '.coffee')
            ]);
        });
        file = null;
        for (i = 0; i < fileGuesses.length && !file; ++i) {
            if (fs.isFile(fileGuesses[i])) {
                file = fileGuesses[i];
            }
        }
        if (!file) {
            throw new window.kasperError("kasperJS couldn't find module " + path);
        }
        if (file in requireCache) {
            return requireCache[file].exports;
        }
        if (/\.json/i.test(file)) {
            var parsed = JSON.parse(fs.read(file));
            requireCache[file] = parsed;
            return parsed;
        }
        var scriptCode = (function getScriptCode(file) {
            var scriptCode = fs.read(file);
            if (/\.coffee$/i.test(file)) {
                /*global CoffeeScript*/
                try {
                    scriptCode = CoffeeScript.compile(scriptCode);
                } catch (e) {
                    throw new Error('Unable to compile coffeescript:' + e);
                }
            }
            return scriptCode;
        })(file);
        var fn = new Function('__file__', 'require', 'module', 'exports', scriptCode);
        try {
            fn(file, _require, module, module.exports);
        } catch (e) {
            var error = new window.kasperError('__mod_error(' + path + ':' + e.line + '):: ' + e);
            error.file = file;
            error.line = e.line;
            error.stack = e.stack;
            error.stackArray = JSON.parse(JSON.stringify(e.stackArray));
            if (error.stackArray.length > 0) {
                error.stackArray[0].sourceURL = file;
            }
            throw error;
        }
        requireCache[file] = module;
        return module.exports;
    };
    patchedRequire.patched = true;
    return patchedRequire;
}

function bootstrap(global) {
    "use strict";
    var phantomArgs = require('system').args;

    /**
     * Hooks in default phantomjs error handler to print a hint when a possible
     * kasperjs command misuse is detected.
     *
     */
    phantom.onError = function onPhantomError(msg, trace) {
        phantom.defaultErrorHandler.apply(phantom, arguments);
        if (msg.indexOf("ReferenceError: Can't find variable: kasper") === 0) {
            console.error('Hint: you may want to use the `kasperjs test` command.');
        }
    };

    /**
     * Loads and initialize the kasperJS environment.
     */
    phantom.loadkasper = function loadkasper() {
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

        // kasper root path
        if (!phantom.kasperPath) {
            try {
                phantom.kasperPath = phantom.args.map(function _map(i) {
                    var match = i.match(/^--kasper-path=(.*)/);
                    if (match) {
                        return fs.absolute(match[1]);
                    }
                }).filter(function _filter(path) {
                    return fs.isDirectory(path);
                }).pop();
            } catch (e) {}
        }

        if (!phantom.kasperPath) {
            console.error("Couldn't find nor compute phantom.kasperPath, exiting.");
            phantom.exit(1);
        }

        // Embedded, up-to-date, validatable & controlable CoffeeScript
        phantom.injectJs(fs.pathJoin(phantom.kasperPath, 'modules', 'vendors', 'coffee-script.js'));

        // custom global kasperError
        global.kasperError = function kasperError(msg) {
            Error.call(this);
            this.message = msg;
            this.name = 'kasperError';
        };

        // standard Error prototype inheritance
        global.kasperError.prototype = Object.getPrototypeOf(new Error());

        // kasperJS version, extracted from package.json - see http://semver.org/
        phantom.kasperVersion = (function getVersion(path) {
            var parts, patchPart, pkg, pkgFile;
            var fs = require('fs');
            pkgFile = fs.absolute(fs.pathJoin(path, 'package.json'));
            if (!fs.exists(pkgFile)) {
                throw new global.kasperError('Cannot find package.json at ' + pkgFile);
            }
            try {
                pkg = JSON.parse(require('fs').read(pkgFile));
            } catch (e) {
                throw new global.kasperError('Cannot read package file contents: ' + e);
            }
            parts  = pkg.version.trim().split(".");
            if (parts.length < 3) {
                throw new global.kasperError("Invalid version number");
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
        })(phantom.kasperPath);

        // patch require
        global.require = patchRequire(global.require, [phantom.kasperPath, fs.workingDirectory]);

        // kasper cli args
        phantom.kasperArgs = global.require('cli').parse(phantom.args);

        // loaded status
        phantom.kasperLoaded = true;
    };

    /**
     * Initializes the kasperJS Command Line Interface.
     */
    phantom.initkasperCli = function initkasperCli() {
        var fs = require("fs");
        var baseTestsPath = fs.pathJoin(phantom.kasperPath, 'tests');

        if (!!phantom.kasperArgs.options.version) {
            console.log(phantom.kasperVersion.toString());
            return phantom.exit();
        } else if (phantom.kasperArgs.get(0) === "test") {
            phantom.kasperScript = fs.absolute(fs.pathJoin(baseTestsPath, 'run.js'));
            phantom.kasperTest = true;
            phantom.kasperArgs.drop("test");
        } else if (phantom.kasperArgs.get(0) === "selftest") {
            phantom.kasperScript = fs.absolute(fs.pathJoin(baseTestsPath, 'run.js'));
            phantom.kasperSelfTest = phantom.kasperTest = true;
            phantom.kasperArgs.options.includes = fs.pathJoin(baseTestsPath, 'selftest.js');
            if (phantom.kasperArgs.args.length <= 1) {
                phantom.kasperArgs.args.push(fs.pathJoin(baseTestsPath, 'suites'));
            }
            phantom.kasperArgs.drop("selftest");
        } else if (phantom.kasperArgs.args.length === 0 || !!phantom.kasperArgs.options.help) {
            var phantomVersion = [phantom.version.major, phantom.version.minor, phantom.version.patch].join('.');
            var f = require("utils").format;
            console.log(f('kasperJS version %s at %s, using PhantomJS version %s',
                        phantom.kasperVersion.toString(),
                        phantom.kasperPath, phantomVersion));
            console.log(fs.read(fs.pathJoin(phantom.kasperPath, 'bin', 'usage.txt')));
            return phantom.exit(0);
        }

        if (!phantom.kasperScript) {
            phantom.kasperScript = phantom.kasperArgs.get(0);
        }

        if (!fs.isFile(phantom.kasperScript)) {
            console.error('Unable to open file: ' + phantom.kasperScript);
            return phantom.exit(1);
        }

        // filter out the called script name from kasper args
        phantom.kasperArgs.drop(phantom.kasperScript);

        // passed kasperjs script execution
        var injected = false;
        try {
            injected = phantom.injectJs(phantom.kasperScript);
        } catch (e) {
            throw new global.kasperError('Error loading script ' + phantom.kasperScript + ': ' + e);
        }
        if (!injected) {
            throw new global.kasperError('Unable to load script ' + phantom.kasperScript + '; check file syntax');
        }
    };

    if (!phantom.kasperLoaded) {
        phantom.loadkasper();
    }

    if (true === phantom.kasperArgs.get('cli')) {
        phantom.initkasperCli();
    }
}
