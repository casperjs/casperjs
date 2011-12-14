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
var fs = require('fs');

var casperScript = phantom.args[1];

if (phantom.args.length < 2) {
    if (!fs.isDirectory(phantom.args[0])) {
        console.log('First argument must be the path to casper root path');
    }
    if (!fs.isFile(casperScript)) {
        console.log('Usage: $ casperjs script.js');
    }
    phantom.exit(1);
}

var casperPath = phantom.args[0];

function pathJoin() {
    return Array.prototype.join.call(arguments, fs.separator);
}

var casperLibPath = pathJoin(casperPath, 'lib');

if (!fs.isDirectory(casperLibPath)) {
    console.log("Couldn't find CasperJS lib directory: " + casperLibPath);
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
    phantom.injectJs(pathJoin(casperLibPath, lib));
});

phantom.injectJs(phantom.args[1]);
