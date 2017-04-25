#!/usr/bin/env nodejs

/*!
 * Casper is a navigation utility for PhantomJS.
 *
 * Documentation: http://casperjs.org/
 * Repository:    http://github.com/casperjs/casperjs
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

/*global phantom, require:true*/

// File system management
var fs = (function patchFs(_fs) {
    'use strict';
    _fs.readlink = _fs.readlinkSync || _fs.readlink;
    if (!_fs.hasOwnProperty('absolute')) {
        var _path = require('path');
        _fs.absolute = function absolute(path) {
            return _path.resolve(path);
        };
    }
    if (_fs.hasOwnProperty('base')) {
        _fs.basename = _fs.base;
    } else if (!_fs.hasOwnProperty('basename')) {
        _fs.basename = function basename(path) {
            return path.replace(/.*\//, '');
        };
    }
    if (_fs.hasOwnProperty('directory')) {
        _fs.dirname = _fs.directory;
    } else if (!_fs.hasOwnProperty('dirname')) {
        _fs.dirname = function dirname(path) {
            if (!path) {
                return null;
            }
            return path.toString().replace(/\\/g, '/').replace(/\/[^\/]*$/, '');
        };
    }
    if (!_fs.hasOwnProperty('islink')) {
        _fs.islink = function islink(path) {
            return fs.lstatSync(path).isSymbolicLink();
        };
    }
    if (!_fs.hasOwnProperty('isWindows')) {
        _fs.isWindows = function isWindows() {
            var testPath = arguments[0] || this.workingDirectory;
            return (/^[a-z]{1,2}:/i).test(testPath) || testPath.indexOf('\\\\') === 0;
        };
    }
    if (_fs.hasOwnProperty('joinPath')) {
        _fs.pathJoin = _fs.joinPath;
    } else if (!_fs.hasOwnProperty('pathJoin')) {
        _fs.pathJoin = function pathJoin() {
            return Array.prototype.filter.call(arguments, function(elm){
                return typeof elm !== 'undefined' && elm !== null;
            }).join('/');
        };
    }
    if (!_fs.hasOwnProperty('scriptDir')) {
        _fs.scriptDir = function scriptDir(args) {
            if (typeof phantom === 'undefined') {
                return args[1];
            }
            return this.pathJoin(fs.workingDirectory, args[0]);
        };
    }
    return _fs;
})(require('fs'));

// System Management
var system = (function (){
    'use strict';
    if (typeof phantom !== 'undefined') {
        var _system = require('system');
        _system.exit = phantom.exit;
        return _system;
    }
    if (typeof phantom === 'undefined') {
        var process = require('process');
        return {
            'args': process.argv,
            'env': process.env,
            'stdout': process.stdout,
            'stderr': process.stderr,
            'stdin': process.stdin,
            'exit': process.exit
        };
    }
})();

// Process management
var spawn = require('child_process').spawn;

var SUPPORTED_ENGINES = {
    'phantomjs': {
        'native_args': [
            'cookies-file',
            'config',
            'debug',
            'disk-cache',
            'disk-cache-path',
            'ignore-ssl-errors',
            'load-images',
            'load-plugins',
            'local-url-access',
            'local-storage-path',
            'local-storage-quota',
            'offline-storage-path',
            'offline-storage-quota',
            'local-to-remote-url-access',
            'max-disk-cache-size',
            'output-encoding',
            'proxy',
            'proxy-auth',
            'proxy-type',
            'remote-debugger-port',
            'remote-debugger-autorun',
            'script-encoding',
            'script-language',
            'ssl-protocol',
            'ssl-ciphers',
            'ssl-certificates-path',
            'ssl-client-certificate-file',
            'ssl-client-key-file',
            'ssl-client-key-passphrase',
            'web-security',
            'webdriver',
            'webdriver-logfile',
            'webdriver-loglevel',
            'webdriver-selenium-grid-hub',
            'wd',
            'w',
        ],
        'env_varname': 'PHANTOMJS_EXECUTABLE',
        'default_exec': 'phantomjs'
    },
    'slimerjs': {
        'native_args': [
            // firefox
            'no-remote',
            'new-instance',
            'safe-mode',
            'browser',
            'preferences',
            'jsconsole',
            'jsdebugger',
            'devtools',
            
            // slimerjs
            '-jsconsole',
            'error-log-file',
            'user-agent',
            'viewport-width',
            'viewport-height',
            
            // phantomjs options
            'cookies-file',
            'config',
            'debug',
            'disk-cache',
            'ignore-ssl-errors',
            'load-images',
            'load-plugins',
            'local-storage-path',
            'local-storage-quota',
            'local-to-remote-url-access',
            'max-disk-cache-size',
            'output-encoding',
            'proxy',
            'proxy-auth',
            'proxy-type',
            'remote-debugger-port',
            'remote-debugger-autorun',
            'script-encoding',
            'ssl-protocol',
            'ssl-certificates-path',
            'web-security',
            'webdriver',
            'webdriver-logfile',
            'webdriver-loglevel',
            'webdriver-selenium-grid-hub',
            'wd',
            'w'
        ],
        'env_varname': 'SLIMERJS_EXECUTABLE',
        'default_exec': 'slimerjs',
        'native_args_with_space': [

            '--createprofile',
            '--profile',
            '-P',
            '-profile',
            '--private-window',
            '--UILocale',
            '--new-window',
            '--new-tab',
            '--search',
            '--recording',
            '--recording-output'
        ]
    }
};


var ENGINE = system.env.CASPERJS_ENGINE || 'phantomjs';
var ENGINE_ARGS = system.env.ENGINE_FLAGS && system.env.ENGINE_FLAGS.split(' ') || [];

var CASPER_ARGS = [];
var CASPER_PATH = fs.absolute(fs.pathJoin(fs.dirname(fs.scriptDir(system.args)), '..'));
var SYS_ARGS = typeof phantom !== 'undefined' ? system.args.slice(1) : system.args.slice(2);
var ENVIRONMENT = system.env;

// retrieve the engine name
for (var i = 0, l = SYS_ARGS.length; i < l; i++) {
    if (SYS_ARGS[i].substr(0, 9) === '--engine=') {
        ENGINE = SYS_ARGS[i].substring(9).toLowerCase();
        break;
    }
}

if (typeof SUPPORTED_ENGINES[ENGINE] === 'undefined') {
    system.stderr.write('Bad engine name. Only phantomjs and slimerjs are supported\n');
    system.exit(1);
}

var ENGINE_NATIVE_ARGS = SUPPORTED_ENGINES[ENGINE].native_args;
var ENGINE_NATIVE_ARGS_WITH_SPACE = SUPPORTED_ENGINES[ENGINE].native_args_with_space || [];
var ENGINE_EXECUTABLE = system.env[SUPPORTED_ENGINES[ENGINE].env_varname] ||
                                   system.env.ENGINE_EXECUTABLE ||
                                       SUPPORTED_ENGINES[ENGINE].default_exec;
var extract_arg_name = function extract_arg_name(arg) {
    'use strict';
//  "parse out any option name"
    try {
        return arg.split('=')[0].replace('--', '');
    } catch(e) {
        return arg;
    }
};

for (i = 0, l = SYS_ARGS.length; i < l; i++) {
    var arg_name = extract_arg_name(SYS_ARGS[i]);

    if (ENGINE_NATIVE_ARGS.indexOf(arg_name) !== -1) {
        ENGINE_ARGS.push(SYS_ARGS[i]);
    } else if (arg_name === "env") {
        var env = SYS_ARGS[i].substring(6).split('=');
        ENVIRONMENT[env[0]] = env[1].replace(/^['"]|['"]$/g, '');
    } else if (ENGINE_NATIVE_ARGS_WITH_SPACE.indexOf(SYS_ARGS[i]) !== -1) {
        if (!SYS_ARGS[i+1] || SYS_ARGS[i+1].substring(0,2) === '--') {
            system.stderr.write('Fatal: Missing expected value for parameter "' + SYS_ARGS[i] + '"\n');
            system.exit(1);
        } 
        i++;
    } else {
        CASPER_ARGS.push(SYS_ARGS[i]);
    }
}

var CASPER_COMMAND = [ENGINE_EXECUTABLE].concat(ENGINE_ARGS).concat([
    fs.pathJoin(CASPER_PATH, 'bin', 'bootstrap.js'),
    '--casper-path=' + CASPER_PATH,
    '--cli'
]).concat(CASPER_ARGS);

var child = spawn(ENGINE_EXECUTABLE, CASPER_COMMAND.slice(1), {
    'env': ENVIRONMENT
});

child.stdout.on('data', function (data) {
    'use strict';
    system.stdout.write(data + "\n");
});

child.stderr.on('data', function (data) {
    'use strict';
    system.stderr.write(data + "\n");
});

child.on('exit', function (code) {
    'use strict';
    system.exit(code);
});
