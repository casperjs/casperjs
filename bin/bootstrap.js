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

phantom.loadCasper = function() {
    // Patching fs
    // TODO: watch for these methods being implemented in official fs module
    var fs = (function(fs) {
        if (!fs.hasOwnProperty('basename')) {
            fs.basename = function(path) {
                return path.replace(/.*\//, '');
            };
        }
        if (!fs.hasOwnProperty('dirname')) {
            fs.dirname = function(path) {
                return path.replace(/\\/g, '/').replace(/\/[^\/]*$/, '');
            };
        }
        if (!fs.hasOwnProperty('isWindows')) {
            fs.isWindows = function() {
                var testPath = arguments[0] || this.workingDirectory;
                return (/^[a-z]{1,2}:/i).test(testPath) || testPath.indexOf("\\\\") === 0;
            };
        }
        if (!fs.hasOwnProperty('pathJoin')) {
            fs.pathJoin = function() {
                return Array.prototype.join.call(arguments, this.separator);
            };
        }
        return fs;
    })(require('fs'));

    // casper root path
    if (!phantom.casperPath) {
        try {
            phantom.casperPath = phantom.args.map(function(i) {
                var match = i.match(/^--casper-path=(.*)/);
                if (match) {
                    return fs.absolute(match[1]);
                }
            }).filter(function(path) {
                return fs.isDirectory(path);
            }).pop();
        } catch (e) {}
    }

    if (!phantom.casperPath) {
        console.error("Couldn't find not compute phantom.casperPath, exiting.");
        phantom.exit(1);
    }

    // Embedded, up-to-date, validatable & controlable CoffeeScript
    phantom.injectJs(fs.pathJoin(phantom.casperPath, 'modules', 'vendors', 'coffee-script.js'));

    // Index of file sources, for error localization
    phantom.sourceIds = {};

    // custom global CasperError
    window.CasperError = function(msg) {
        Error.call(this);
        try {
            // let's get where this error has been thrown from, if we can
            this._from = arguments.callee.caller.name;
        } catch (e) {
            this._from = "anonymous";
        }
        this.message = msg;
        this.name = 'CasperError';
    };

    // standard Error prototype inheritance
    window.CasperError.prototype = Object.getPrototypeOf(new Error());

    // Stack formatting
    window.CasperError.prototype.formatStack = function() {
        var location = this.fileName || phantom.sourceIds[this.sourceId] || "unknown";
        location += ':' + (this.line ?  this.line : 0);
        return this.toString() + '\n    ' + (this._from || "anonymous") + '() at ' + location;
    };

    /**
     * Adding pseudo stack traces to CasperError
     * Inspired by phantomjs-nodify: https://github.com/jgonera/phantomjs-nodify/
     * TODO: remove when phantomjs has js engine upgrade
     */
    if (!new CasperError().hasOwnProperty('stack')) {
        Object.defineProperty(CasperError.prototype, 'stack', {
            set: function(string) {
                this._stack = string;
            },
            get: function() {
                if (this._stack) {
                    return this._stack;
                }
                return this.formatStack();
            },
            configurable: true,
            enumerable: true
        });
    }

    // CasperJS version, extracted from package.json - see http://semver.org/
    phantom.casperVersion = (function getVersion(path) {
        var parts, patchPart, pkg, pkgFile;
        var fs = require('fs');
        pkgFile = fs.absolute(fs.pathJoin(path, 'package.json'));
        if (!fs.exists(pkgFile)) {
            throw new CasperError('Cannot find package.json at ' + pkgFile);
        }
        try {
            pkg = JSON.parse(require('fs').read(pkgFile));
        } catch (e) {
            throw new CasperError('Cannot read package file contents: ' + e);
        }
        parts  = pkg.version.trim().split(".");
        if (parts < 3) {
            throw new CasperError("Invalid version number");
        }
        patchPart = parts[2].split('-');
        return {
            major: ~~parts[0]       || 0,
            minor: ~~parts[1]       || 0,
            patch: ~~patchPart[0]   || 0,
            ident: patchPart[1]     || "",
            toString: function() {
                var version = [this.major, this.minor, this.patch].join('.');
                if (this.ident) {
                    version = [version, this.ident].join('-');
                }
                return version;
            }
        };
    })(phantom.casperPath);

    /**
     * Retrieves the javascript source code from a given .js or .coffee file.
     *
     * @param  String         file     The path to the file
     * @param  Function|null  onError  An error callback (optional)
     */
    phantom.getScriptCode = function(file, onError) {
        var scriptCode = fs.read(file);
        if (/\.coffee$/i.test(file)) {
            try {
                scriptCode = CoffeeScript.compile(scriptCode);
            } catch (e) {
                this.processScriptError(e, file, onError);
            }
        }
        // trick to locate source file location on error
        scriptCode += ";var __fe__ = new CasperError('__sourceId__')";
        scriptCode += ";__fe__.fileName = '" + file.replace(/\\+/g, '/') + "'";
        scriptCode += ";throw __fe__;";
        return scriptCode;
    };

    /**
     * Processes a given thrown Error; handles special cases and provides an
     * optional callback argument.
     *
     * By default, the standard behavior on uncaught error is to print the
     * error stack trace to the console and exit PhantomJS.
     *
     * @param  Error     error     The Error instance
     * @param  String    file      A file path to associate to this error
     * @param  Function  callback  An optional callback
     */
    phantom.processScriptError = function(error, file, callback) {
        if (!this.sourceIds.hasOwnProperty(error.sourceId)) {
            this.sourceIds[error.sourceId] = file;
        }
        if (error.message === "__sourceId__") {
            return;
        }
        if (typeof callback === "function") {
            callback(error, file);
        } else {
            console.error(error.stack);
            this.exit(1);
        }
    };

    /**
     * Patching require() to allow loading of other modules than PhantomJS'
     * builtin ones.
     * Inspired by phantomjs-nodify: https://github.com/jgonera/phantomjs-nodify/
     * TODO: remove when PhantomJS has full module support
     */
    require = (function(require, requireDir) {
        var phantomBuiltins = ['fs', 'webpage', 'webserver'];
        var phantomRequire = phantom.__orig__require = require;
        var requireCache = {};
        return function(path) {
            var i, dir, paths = [],
                fileGuesses = [],
                file,
                module = {
                    exports: {}
                };
            if (phantomBuiltins.indexOf(path) !== -1) {
                return phantomRequire(path);
            }
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
                    // nodejs compatibility
                    paths.push(fs.pathJoin(dir, 'node_modules', path));
                    dir = fs.dirname(dir);
                }
                paths.push(fs.pathJoin(requireDir, 'lib', path));
                paths.push(fs.pathJoin(requireDir, 'modules', path));
            }
            paths.forEach(function(testPath) {
                fileGuesses.push.apply(fileGuesses, [
                    testPath,
                    testPath + '.js',
                    testPath + '.coffee',
                    fs.pathJoin(testPath, 'index.js'),
                    fs.pathJoin(testPath, 'index.coffee'),
                    fs.pathJoin(testPath, 'lib', fs.basename(testPath) + '.js'),
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
                throw new Error("CasperJS couldn't find module " + path);
            }
            if (file in requireCache) {
                return requireCache[file].exports;
            }
            try {
                var scriptCode = phantom.getScriptCode(file);
                new Function('module', 'exports', scriptCode)(module, module.exports);
            } catch (e) {
                phantom.processScriptError(e, file);
            }
            requireCache[file] = module;
            return module.exports;
        };
    })(require, phantom.casperPath);

    // BC < 0.6
    phantom.Casper = require('casper').Casper;

    // casper cli args
    phantom.casperArgs = require('cli').parse(phantom.args);

    // loaded status
    phantom.casperLoaded = true;
};

phantom.initCasperCli = function() {
    var fs = require("fs");

    if (!!phantom.casperArgs.options.version) {
        console.log(phantom.casperVersion.toString());
        phantom.exit(0);
    } else if (phantom.casperArgs.get(0) === "test") {
        phantom.casperScript = fs.absolute(fs.pathJoin(phantom.casperPath, 'tests', 'run.js'));
        phantom.casperArgs.drop("test");
    } else if (phantom.casperArgs.args.length === 0 || !!phantom.casperArgs.options.help) {
        var phantomVersion = [phantom.version.major, phantom.version.minor, phantom.version.patch].join('.');
        var f = require("utils").format;
        console.log(f('CasperJS version %s at %s, using PhantomJS version %s',
                    phantom.casperVersion.toString(),
                    phantom.casperPath, phantomVersion));
        console.log(fs.read(fs.pathJoin(phantom.casperPath, 'bin', 'usage.txt')));
        phantom.exit(0);
    }


    if (!phantom.casperScript) {
        phantom.casperScript = phantom.casperArgs.get(0);
    }

    if (!fs.isFile(phantom.casperScript)) {
        console.error('Unable to open file: ' + phantom.casperScript);
        phantom.exit(1);
    }


    // filter out the called script name from casper args
    phantom.casperArgs.drop(phantom.casperScript);

    // passed casperjs script execution
    try {
        new Function(phantom.getScriptCode(phantom.casperScript))();
    } catch (e) {
        phantom.processScriptError(e, phantom.casperScript);
    }
};

if (!phantom.casperLoaded) {
    try {
        phantom.loadCasper();
    } catch (e) {
        console.error("Unable to load casper environment: " + e);
        phantom.exit();
    }
}

if (true === phantom.casperArgs.get('cli')) {
    phantom.initCasperCli();
}
