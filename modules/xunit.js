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

var utils = require('utils');

exports.create = function() {
    return new XUnitExporter();
};

/**
 * JUnit XML (xUnit) exporter for test results.
 *
 */
XUnitExporter = function() {
    this._xml = utils.node('testsuite');
    this._xml.toString = function() {
        return this.outerHTML; // ouch
    };
};
exports.XUnitExporter = XUnitExporter;

/**
 * Adds a successful test result
 *
 * @param  String  classname
 * @param  String  name
 */
XUnitExporter.prototype.addSuccess = function(classname, name) {
    this._xml.appendChild(utils.node('testcase', {
        classname: classname,
        name:      name
    }));
};

/**
 * Adds a failed test result
 *
 * @param  String  classname
 * @param  String  name
 * @param  String  message
 * @param  String  type
 */
XUnitExporter.prototype.addFailure = function(classname, name, message, type) {
    var fnode = utils.node('testcase', {
        classname: classname,
        name:      name
    });
    var failure = utils.node('failure', {
        type: type || "unknown"
    });
    failure.appendChild(document.createTextNode(message || "no message left"));
    fnode.appendChild(failure);
    this._xml.appendChild(fnode);
};

/**
 * Retrieves generated XML object - actually an HTMLElement.
 *
 * @return HTMLElement
 */
XUnitExporter.prototype.getXML = function() {
    return this._xml;
};
