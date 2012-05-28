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
if (phantom.version.major !== 1 || phantom.version.minor < 5) {
    console.error('CasperJS needs at least PhantomJS v1.5.0');
    phantom.exit(1);
}

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
    window.CasperError = function CasperError(msg) {
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
            toString: function toString() {
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
    phantom.getScriptCode = function getScriptCode(file, onError) {
        var scriptCode = fs.read(file);
        if (/\.coffee$/i.test(file)) {
            scriptCode = CoffeeScript.compile(scriptCode);
        }
        return scriptCode;
    };

    /**
     * Patching require() to allow loading of other modules than PhantomJS'
     * builtin ones.
     * Inspired by phantomjs-nodify: https://github.com/jgonera/phantomjs-nodify/
     * TODO: remove when PhantomJS has full module support
     */
    require = (function _require(require, requireDir) {
        var phantomBuiltins = ['fs', 'webpage', 'webserver', 'system'];
        var phantomRequire = phantom.__orig__require = require;
        var requireCache = {};
        return function _require(path) {
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
            paths.forEach(function _forEach(testPath) {
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
            var scriptCode = phantom.getScriptCode(file);
            var fn = new Function('__file__', 'require', 'module', 'exports', scriptCode);
            try {
                fn(file, _require, module, module.exports);
            } catch (e) {
                var error = new CasperError('__mod_error(' + path + '):: ' + e);
                error.file = file;
                throw error;
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

/**
 * Custom global error handler.
 */
phantom.onError = function phantom_onError(msg, backtrace) {
    var c = require('colorizer').create();
    var match = /^(.*): __mod_error(.*):: (.*)/.exec(msg);
    var notices = [];
    if (match && match.length === 4) {
        notices.push('  in module ' + match[2]);
        notices.push('  NOTICE: errors within modules cannot be backtraced yet.');
        msg = match[3];
    }
    console.error(c.colorize(msg, 'RED_BAR', 80));
    notices.forEach(function(notice) {
        console.error(c.colorize(notice, 'COMMENT'));
    });
    backtrace.forEach(function(item) {
        var message = require('fs').absolute(item.file) + ":" + c.colorize(item.line, "COMMENT");
        if (item['function']) {
            message += " in " + c.colorize(item['function'], "PARAMETER");
        }
        console.error("  " + message);
    });
    phantom.exit(1);
};

/**
 * Initializes the CasperJS Command Line Interface.
 */
phantom.initCasperCli = function initCasperCli() {
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
    phantom.injectJs(phantom.casperScript);
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
