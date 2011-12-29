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
exports.betterTypeOf = betterTypeOf;

/**
 * Dumps a JSON representation of passed value to the console. Used for
 * debugging purpose only.
 *
 * @param  Mixed  value
 */
function dump(value) {
    console.log(serialize(value));
}
exports.dump = dump;

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
exports.fileExt = fileExt;

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
exports.fillBlanks = fillBlanks;

function isArray(value) {
    return isType(value, "array");
}
exports.isArray = isArray;

/**
 * Checks if passed argument is an instance of Capser object.
 *
 * @param  mixed  value
 * @return Boolean
 */
function isCasperObject(value) {
    return value instanceof require('casper').Casper;
}
exports.isCasperObject = isCasperObject;

function isClipRect(value) {
    return isType(value, "cliprect") || (
        isType(value, "object") &&
        isType(value.top, "number") &&
        isType(value.left, "number") &&
        isType(value.width, "number") &&
        isType(value.height, "number")
    );
}
exports.isClipRect = isClipRect;

function isFunction(value) {
    return isType(value, "function");
}
exports.isFunction = isFunction;

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
exports.isJsFile = isJsFile;

function isObject(value) {
    return isType(value, "object");
}
exports.isObject = isObject;

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
exports.isType = isType;

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
exports.isWebPage = isWebPage;

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
exports.mergeObjects = mergeObjects;

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
exports.serialize = serialize;
