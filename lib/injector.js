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
     * Function argument injector.
     *
     */
    phantom.Casper.FunctionArgsInjector = function(fn) {
        if (!isType(fn, "function")) {
            throw new Error("FunctionArgsInjector() can only process functions");
        }
        this.fn = fn;

        this.extract = function(fn) {
            var match = /^function\s?(\w+)?\s?\((.*)\)\s?\{([\s\S]*)\}/i.exec(fn.toString().trim());
            if (match && match.length > 1) {
                var args = match[2].split(',').map(function(arg) {
                    return arg.replace(new RegExp(/\/\*+.*\*\//ig), "").trim();
                }).filter(function(arg) {
                    return arg;
                }) || [];
                return {
                    name: match[1] ? match[1].trim() : null,
                    args: args,
                    body: match[3] ? match[3].trim() : ''
                };
            }
        };

        this.process = function(values) {
            var fnObj = this.extract(this.fn);
            if (!isType(fnObj, "object")) {
                throw new Error("Unable to process function " + this.fn.toString());
            }
            var inject = this.getArgsInjectionString(fnObj.args, values);
            return 'function ' + (fnObj.name || '') + '(){' + inject + fnObj.body + '}';
        };

        this.getArgsInjectionString = function(args, values) {
            values = typeof values === "object" ? values : {};
            var jsonValues = escape(encodeURIComponent(JSON.stringify(values)));
            var inject = [
                'var __casper_params__ = JSON.parse(decodeURIComponent(unescape(\'' + jsonValues + '\')));'
            ];
            args.forEach(function(arg) {
                if (arg in values) {
                    inject.push('var ' + arg + '=__casper_params__["' + arg + '"];');
                }
            });
            return inject.join('\n') + '\n';
        };
    };
})(phantom);