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
    /**
     * JUnit XML (xUnit) exporter for test results.
     *
     */
    phantom.Casper.XUnitExporter = function() {
        var node = function(name, attributes) {
            var node = document.createElement(name);
            for (var attrName in attributes) {
                var value = attributes[attrName];
                if (attributes.hasOwnProperty(attrName) && isType(attrName, "string")) {
                    node.setAttribute(attrName, value);
                }
            }
            return node;
        };

        var xml = node('testsuite');
        xml.toString = function() {
            return this.outerHTML; // ouch
        };

        /**
         * Adds a successful test result
         *
         * @param  String  classname
         * @param  String  name
         */
        this.addSuccess = function(classname, name) {
            xml.appendChild(node('testcase', {
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
        this.addFailure = function(classname, name, message, type) {
            var fnode = node('testcase', {
                classname: classname,
                name:      name
            });
            var failure = node('failure', {
                type: type || "unknown"
            });
            failure.appendChild(document.createTextNode(message || "no message left"));
            fnode.appendChild(failure);
            xml.appendChild(fnode);
        };

        /**
         * Retrieves generated XML object - actually an HTMLElement.
         *
         * @return HTMLElement
         */
        this.getXML = function() {
            return xml;
        };
    };
})(phantom);