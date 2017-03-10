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

/*global CasperError, console, exports, phantom, patchRequire, require:true*/

require = patchRequire(require);
var utils = require('utils');
var f = utils.format;

function create() {
    "use strict";
    return new Stack();
}
exports.create = create;

/**
 * Popups container. Implements Array prototype.
 *
 */
var Stack = function Stack(){};
exports.Stack = Stack;

Stack.prototype = [];

/**
 * Cleans the stack from any closed popups.
 *
 * @return Number           New stack length
 */
Stack.prototype.clean = function clean() {
    "use strict";
    var self = this;

    this.forEach(function(popup, index) {
        // window references lose the parent attribute when they are no longer valid
        if (popup.parent === null || typeof popup.parent === "undefined") {
            self.splice(index, 1);
        }
    });
    return this.length;
};

/**
 * Finds a popup matching the provided information. Information can be:
 *
 * - RegExp: matching page url
 * - String: strict page url value
 * - WebPage: a direct WebPage instance
 *
 * @param  Mixed  popupInfo
 * @return WebPage
 */
Stack.prototype.find = function find(popupInfo) {
    "use strict";
    var popup, type = utils.betterTypeOf(popupInfo);
    switch (type) {
        case "regexp":
            popup = this.findByRegExp(popupInfo);
            break;
        case "string":
            popup = this.findByURL(popupInfo);
            break;
        case "object":
            popup = this.findByUrlNameTitle(popupInfo);
            break;
        case "number":
            popup = this.findByIndex(popupInfo);
            break;
        case "qtruntimeobject": // WebPage
            popup = popupInfo;
            if (!utils.isWebPage(popup) || !this.some(function(popupPage) {
                if (popupInfo.id && popupPage.id) {
                    return popupPage.id === popup.id;
                }
                return popupPage.url === popup.url;
            })) {
                throw new CasperError("Invalid or missing popup.");
            }
            break;
        default:
            throw new CasperError(f("Invalid popupInfo type: %s.", type));
    }
    return popup;
};

/**
 * Finds the first popup which url matches a given RegExp.
 *
 * @param  RegExp  regexp
 * @return WebPage
 */
Stack.prototype.findByRegExp = function findByRegExp(regexp) {
    "use strict";
    var popup = this.filter(function(popupPage) {
        return regexp.test(popupPage.url);
    })[0];
    if (!popup) {
        throw new CasperError(f("Couldn't find popup with url matching pattern %s", regexp));
    }
    return popup;
};

/**
 * Finds the first popup matching a given title.
 *
 * @param  String  url  The child WebPage title
 * @return WebPage
 */
Stack.prototype.findByTitle = function findByTitle(string) {
    "use strict";
    var popup = this.filter(function(popupPage) {
        return popupPage.title.indexOf(string) !== -1;
    })[0];
    if (!popup) {
        throw new CasperError(f("Couldn't find popup with title containing '%s'", string));
    }
    return popup;
};

/**
 * Finds the first popup matching a given url.
 *
 * @param  String  url  The child WebPage url
 * @return WebPage
 */
Stack.prototype.findByURL = function findByURL(string) {
    "use strict";
    var popup = this.filter(function(popupPage) {
        return popupPage.url.indexOf(string) !== -1;
    })[0];
    if (!popup) {
        throw new CasperError(f("Couldn't find popup with url containing '%s'", string));
    }
    return popup;
};

/**
 * Finds the first popup matching a given url or name or title.
 *
 * @param  String  url  The child WebPage url or name or title
 * @return WebPage
 */
Stack.prototype.findByUrlNameTitle = function findByUrlNameTitle(object) {
    "use strict";
    var popup = null;
    try {
        if (typeof object.url !== "undefined") {
            popup = this.findByUrl(object.url);
        }
        if (!popup && typeof object.title !== "undefined") {
            popup = this.findByTitle(object.title);
        }
        if (!popup && typeof object.windowName !== "undefined") {
            popup = this.findByWindowName(object.windowName);
        }
    } catch(e){}

    if (!popup) {
        throw new CasperError(f("Couldn't find popup with object '%s'", JSON.stringify(object)));
    }
    return popup;
};

/**
 * Finds the first popup matching a given window name.
 *
 * @param  String  url  The child WebPage window name
 * @return WebPage
 */
Stack.prototype.findByWindowName = function findByWindowName(string) {
    "use strict";
    
    var popup = this.filter(function(popupPage) {
        return popupPage.windowName.indexOf(string) !== -1 || popupPage.windowNameBackUp.indexOf(string) !== -1;
    })[0];
    if (!popup) {
        throw new CasperError(f("Couldn't find popup with name containing '%s'", string));
    }
    return popup;
};

/**
 * Finds the first popup matching a given index.
 *
 * @param  Number  index  The child WebPage index
 * @return WebPage
 */
Stack.prototype.findByIndex = function findByIndex(index) {
    "use strict";
    var popup = this[index];
    if (!popup) {
        throw new CasperError(f("Couldn't find popup with index containing '%d'", index));
    }
    return popup;
};

/**
 * Returns a human readable list of current active popup urls.
 *
 * @return Array  Mapped stack.
 */
Stack.prototype.list = function list() {
    "use strict";
    return this.map(function(popup) {
        try {
            return popup.url;
        } catch (e) {
            return '<deleted>';
        }
    });
};

/**
 * String representation of current instance.
 *
 * @return String
 */
Stack.prototype.toString = function toString() {
    "use strict";
    return f("[Object Stack], having %d popup(s)" % this.length);
};
