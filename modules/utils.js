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
 * Takes a string and append blanks until the pad value is reached.
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

/**
 * Formats a string with passed parameters. Ported from nodejs `util.format()`.
 *
 * @return String
 */
function format(f) {
    var i;
    if (typeof f !== 'string') {
        var objects = [];
        for (i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]));
        }
        return objects.join(' ');
    }
    i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(/%[sdj%]/g, function(x) {
        if (i >= len) return x;
        switch (x) {
        case '%s':
            return String(args[i++]);
        case '%d':
            return Number(args[i++]);
        case '%j':
            return JSON.stringify(args[i++]);
        case '%%':
            return '%';
        default:
            return x;
        }
    });
    for (var x = args[i]; i < len; x = args[++i]) {
        if (x === null || typeof x !== 'object') {
            str += ' ' + x;
        } else {
            str += ' ' + inspect(x);
        }
    }
    return str;
}
exports.format = format;

/**
 * Inherit the prototype methods from one constructor into another, also
 * exposes the `__super__` property to child class.
 *
 * @param  Function  child   Constructor function which needs to inherit the
 *                           prototype.
 * @param  Function  parent  Constructor function to inherit prototype from.
 * @return Function          The child class
 */
function inherits(child, parent) {
    for (var key in parent) {
        if (Object.prototype.hasOwnProperty.call(parent, key)) {
            child[key] = parent[key];
        }
    }
    function ctor() {
        this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
}
exports.inherits = inherits;

/**
 * Checks if value is a javascript Array
 *
 * @param  mixed  value
 * @return Boolean
 */
function isArray(value) {
    return Array.isArray(value) || isType(value, "array");
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

/**
 * Checks if value is a phantomjs clipRect-compatible object
 *
 * @param  mixed  value
 * @return Boolean
 */
function isClipRect(value) {
    return isType(value, "cliprect") || (
        isObject(value) &&
        isNumber(value.top) && isNumber(value.left) &&
        isNumber(value.width) && isNumber(value.height)
    );
}
exports.isClipRect = isClipRect;

/**
 * Checks if value is a javascript Function
 *
 * @param  mixed  value
 * @return Boolean
 */
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
    return isString(ext, "string") && ['js', 'coffee'].indexOf(ext) !== -1;
}
exports.isJsFile = isJsFile;

/**
 * Checks if the provided value is null
 *
 * @return Boolean
 */
function isNull(value) {
    return isType(value, "null");
}
exports.isNull = isNull;

/**
 * Checks if value is a javascript Number
 *
 * @param  mixed  value
 * @return Boolean
 */
function isNumber(value) {
    return isType(value, "number");
}
exports.isNumber = isNumber;

/**
 * Checks if value is a javascript Object
 *
 * @param  mixed  value
 * @return Boolean
 */
function isObject(value) {
    return isType(value, "object");
}
exports.isObject = isObject;

/**
 * Checks if value is a javascript String
 *
 * @param  mixed  value
 * @return Boolean
 */
function isString(value) {
    return isType(value, "string");
}
exports.isString = isString;

/**
 * Shorthands for checking if a value is of the given type. Can check for
 * arrays.
 *
 * @param  mixed   what      The value to check
 * @param  String  typeName  The type name ("string", "number", "function", etc.)
 * @return Boolean
 */
function isType(what, typeName) {
    if (typeof typeName !== "string" || !typeName) {
        throw new CasperError("You must pass isType() a typeName string");
    }
    return betterTypeOf(what).toLowerCase() === typeName.toLowerCase();
}
exports.isType = isType;

/**
 * Checks if the provided value is undefined
 *
 * @return Boolean
 */
function isUndefined(value) {
    return isType(value, "undefined");
}
exports.isUndefined = isUndefined;

/**
 * Checks if the provided var is a WebPage instance
 *
 * @param  mixed  what
 * @return Boolean
 */
function isWebPage(what) {
    if (!what || !isObject(what)) {
        return false;
    }
    if (phantom.version.major <= 1 && phantom.version.minor < 3 && isFunction(require)) {
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
 * Creates an (SG|X)ML node element.
 *
 * @param  String  name        The node name
 * @param  Object  attributes  Optional attributes
 * @return HTMLElement
 */
function node(name, attributes) {
    var _node = document.createElement(name);
    for (var attrName in attributes) {
        var value = attributes[attrName];
        if (attributes.hasOwnProperty(attrName) && isString(attrName)) {
            _node.setAttribute(attrName, value);
        }
    }
    return _node;
}
exports.node = node;

/**
 * Serializes a value using JSON.
 *
 * @param  Mixed  value
 * @return String
 */
function serialize(value) {
    if (isArray(value)) {
        value = value.map(function(prop) {
            return isFunction(prop) ? prop.toString().replace(/\s{2,}/, '') : prop;
        });
    }
    return JSON.stringify(value, null, 4);
}
exports.serialize = serialize;
