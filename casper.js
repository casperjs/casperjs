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

    if (!fs.isDirectory(phantom.args[0]) || !fs.isFile(fs.pathJoin(phantom.args[0], 'casper.js'))) {
        console.log('First argument must be the absolute path to casper root path.');
        phantom.exit(1);
    }

    if (!fs.isFile(phantom.args[1])) {
        console.log('Usage: $ casperjs script.[js|coffee]');
        phantom.exit(1);
    }

    phantom.casperPath = phantom.args[0];
    phantom.casperScript = phantom.args[1];
    phantom.casperLibPath = fs.pathJoin(phantom.casperPath, 'lib');

    [
        'casper.js',
        'clientutils.js',
        'colorizer.js',
        'injector.js',
        'tester.js',
        'utils.js',
        'xunit.js'
    ].forEach(function(lib) {
        phantom.injectJs(fs.pathJoin(phantom.casperLibPath, lib));
    });

    phantom.injectJs(phantom.args[1]);

})(phantom);
