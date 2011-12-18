/*!
 * Casper is a navigation utility for PhantomJS.
 *
 * Documentation: http://n1k0.github.com/casperjs/
 * Repository:    http://github.com/n1k0/casperjs
 *
 * Copyright (c) 2011 Nicolas Perriault
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
(function(phantom) {
    var fs = require('fs');

    fs.pathJoin = function() {
        return Array.prototype.join.call(arguments, this.separator);
    };

    phantom.extractCasperArgs = function(cliArgs) {
        var extract = { args: [], options: {} };
        cliArgs.forEach(function(arg) {
            if (arg.indexOf('--') === 0) {
                // named option
                var optionMatch = arg.match(/^--(.*)=(.*)/i);
                if (optionMatch) {
                    extract.options[optionMatch[1]] = optionMatch[2];
                } else {
                    // flag
                    var flagMatch = arg.match(/^--(.*)/);
                    if (flagMatch) {
                        extract.options[flagMatch[1]] = true;
                    }
                }
            } else {
                // positional arg
                extract.args.push(arg);
            }
        });
        return extract;
    };

    phantom.casperArgs = phantom.extractCasperArgs(phantom.args);
    phantom.casperPath = phantom.casperArgs.options['casper-path'];
    //console.log(JSON.stringify(phantom.casperArgs, null, 4))

    if (!phantom.casperPath) {
        console.log('Cannot find CasperJS home path. Did you set phantom.casperPath or pass the --casper-path option?');
        phantom.exit(1);
    } else if (!fs.isDirectory(phantom.casperPath)) {
        console.log('Invalid CasperJS path: ' + phantom.casperPath);
        phantom.exit(1);
    }

    [
        'casper.js',
        'clientutils.js',
        'colorizer.js',
        'injector.js',
        'tester.js',
        'utils.js',
        'xunit.js'
    ].forEach(function(lib) {
        phantom.injectJs(fs.pathJoin(phantom.casperPath, 'lib', lib));
    });

    if (phantom.casperArgs.args.length === 0 || !!phantom.casperArgs.options.help) {
        console.log('Usage: casperjs script.(js|coffee) [options...]');
        console.log('Read the docs http://n1k0.github.com/casperjs/');
        phantom.exit(0);
    }

    phantom.casperScript = phantom.casperArgs.args[0];

    if (!fs.isFile(phantom.casperScript)) {
        console.log('Unable to open file: ' + phantom.casperScript);
        phantom.exit(1);
    }

    phantom.injectJs(phantom.casperScript);
})(phantom);
