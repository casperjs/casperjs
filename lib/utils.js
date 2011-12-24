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

/**
 * Provides a better typeof operator equivalent, able to retrieve the array
 * type.
 *
 * @param  mixed  input
 * @return String
 * @see    http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
 */
function betterTypeOf(input) {
    try {
        return Object.prototype.toString.call(input).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
    } catch (e) {
        return typeof input;
    }
}

/**
 * Creates a new WebPage instance for Casper use.
 *
 * @param  Casper  casper  A Casper instance
 * @return WebPage
 */
function createPage(casper) {
    var page;
    if (phantom.version.major <= 1 && phantom.version.minor < 3 && isType(require, "function")) {
        page = new WebPage();
    } else {
        page = require('webpage').create();
    }
    page.onAlert = function(message) {
        casper.log('[alert] ' + message, "info", "remote");
        if (isType(casper.options.onAlert, "function")) {
            casper.options.onAlert.call(casper, casper, message);
        }
    };
    page.onConsoleMessage = function(msg) {
        var level = "info", test = /^\[casper:(\w+)\]\s?(.*)/.exec(msg);
        if (test && test.length === 3) {
            level = test[1];
            msg = test[2];
        }
        casper.log(msg, level, "remote");
    };
    page.onLoadStarted = function() {
        casper.resources = [];
        casper.loadInProgress = true;
    };
    page.onLoadFinished = function(status) {
        if (status !== "success") {
            var message = 'Loading resource failed with status=' + status;
            if (casper.currentHTTPStatus) {
                message += ' (HTTP ' + casper.currentHTTPStatus + ')';
            }
            message += ': ' + casper.requestUrl;
            casper.log(message, "warning");
            if (isType(casper.options.onLoadError, "function")) {
                casper.options.onLoadError.call(casper, casper, casper.requestUrl, status);
            }
        }
        if (casper.options.clientScripts) {
            if (betterTypeOf(casper.options.clientScripts) !== "array") {
                casper.log("The clientScripts option must be an array", "error");
            } else {
                for (var i = 0; i < casper.options.clientScripts.length; i++) {
                    var script = casper.options.clientScripts[i];
                    if (casper.page.injectJs(script)) {
                        casper.log('Automatically injected ' + script + ' client side', "debug");
                    } else {
                        casper.log('Failed injecting ' + script + ' client side', "warning");
                    }
                }
            }
        }
        // Client-side utils injection
        var injected = page.evaluate(replaceFunctionPlaceholders(function() {
            eval("var ClientUtils = " + decodeURIComponent("%utils%"));
            __utils__ = new ClientUtils();
            return __utils__ instanceof ClientUtils;
        }, {
            utils: encodeURIComponent(require('./lib/clientutils').ClientUtils.toString())
        }));
        if (!injected) {
            casper.log("Failed to inject Casper client-side utilities!", "warning");
        } else {
            casper.log("Successfully injected Casper client-side utilities", "debug");
        }
        // history
        casper.history.push(casper.getCurrentUrl());
        casper.loadInProgress = false;
    };
    page.onResourceReceived = function(resource) {
        if (isType(casper.options.onResourceReceived, "function")) {
            casper.options.onResourceReceived.call(casper, casper, resource);
        }
        if (resource.stage === "end") {
            casper.resources.push(resource);
        }
        if (resource.url === casper.requestUrl && resource.stage === "start") {
            casper.currentHTTPStatus = resource.status;
            if (isType(casper.options.httpStatusHandlers, "object") &&
                resource.status in casper.options.httpStatusHandlers &&
                isType(casper.options.httpStatusHandlers[resource.status], "function")) {
                casper.options.httpStatusHandlers[resource.status].call(casper, casper, resource);
            }
            casper.currentUrl = resource.url;
        }
    };
    page.onResourceRequested = function(request) {
        if (isType(casper.options.onResourceRequested, "function")) {
            casper.options.onResourceRequested.call(casper, casper, request);
        }
    };
    return page;
}

/**
 * Dumps a JSON representation of passed value to the console. Used for
 * debugging purpose only.
 *
 * @param  Mixed  value
 */
function dump(value) {
    console.log(serialize(value));
}

/**
 * Returns the file extension in lower case.
 *
 * @param  String  file  File path
 * @return string
 */
function fileExt(file) {
    try {
        return file.split('.').pop().toLowerCase().trim();
    } catch(e) {
        return '';
    }
}

/**
 * Takes a string and append blank until the pad value is reached.
 *
 * @param  String  text
 * @param  Number  pad   Pad value (optional; default: 80)
 * @return String
 */
function fillBlanks(text, pad) {
    pad = pad || 80;
    if (text.length < pad) {
        text += new Array(pad - text.length + 1).join(' ');
    }
    return text;
}

/**
 * Checks if a file is apparently javascript compatible (.js or .coffee).
 *
 * @param  String  file  Path to the file to test
 * @return Boolean
 */
function isJsFile(file) {
    var ext = fileExt(file);
    return isType(ext, "string") && ['js', 'coffee'].indexOf(ext) !== -1;
}

/**
 * Shorthands for checking if a value is of the given type. Can check for
 * arrays.
 *
 * @param  mixed   what      The value to check
 * @param  String  typeName  The type name ("string", "number", "function", etc.)
 * @return Boolean
 */
function isType(what, typeName) {
    return betterTypeOf(what) === typeName;
}

/**
 * Checks if the provided var is a WebPage instance
 *
 * @param  mixed  what
 * @return Boolean
 */
function isWebPage(what) {
    if (!what || !isType(what, "object")) {
        return false;
    }
    if (phantom.version.major <= 1 && phantom.version.minor < 3 && isType(require, "function")) {
        return what instanceof WebPage;
    } else {
        return what.toString().indexOf('WebPage(') === 0;
    }
}

/**
 * Object recursive merging utility.
 *
 * @param  Object  obj1  the destination object
 * @param  Object  obj2  the source object
 * @return Object
 */
function mergeObjects(obj1, obj2) {
    for (var p in obj2) {
        try {
            if (obj2[p].constructor === Object) {
                obj1[p] = mergeObjects(obj1[p], obj2[p]);
            } else {
                obj1[p] = obj2[p];
            }
        } catch(e) {
          obj1[p] = obj2[p];
        }
    }
    return obj1;
}

/**
 * Replaces a function string contents with placeholders provided by an
 * Object.
 *
 * @param  Function  fn            The function
 * @param  Object    replacements  Object containing placeholder replacements
 * @return String                  A function string representation
 */
function replaceFunctionPlaceholders(fn, replacements) {
    if (replacements && isType(replacements, "object")) {
        fn = fn.toString();
        for (var placeholder in replacements) {
            var match = '%' + placeholder + '%';
            do {
                fn = fn.replace(match, replacements[placeholder]);
            } while(fn.indexOf(match) !== -1);
        }
    }
    return fn;
}

/**
 * Serializes a value using JSON.
 *
 * @param  Mixed  value
 * @return String
 */
function serialize(value) {
    if (isType(value, "array")) {
        value = value.map(function(prop) {
            return isType(prop, "function") ? prop.toString().replace(/\s{2,}/, '') : prop;
        });
    }
    return JSON.stringify(value, null, 4);
}
