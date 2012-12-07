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

/*global CasperError console exports phantom require*/

var utils = require('utils');
var f = utils.format;

/**
 * Child pages container. Implements Array prototype.
 *
 */
var ChildPages = function ChildPages(){};
exports.ChildPages = ChildPages;

ChildPages.prototype = [];

/**
 * Finds a child page matching the provided information. Information can be:
 *
 * - RegExp: matching page url
 * - String: strict page url value
 * - WebPage: a direct WebPage instance
 *
 * @param  Mixed  pageInfo
 * @return WebPage
 */
ChildPages.prototype.find = function find(pageInfo) {
    "use strict";
    var childPage, type = utils.betterTypeOf(pageInfo);
    switch (type) {
        case "regexp":
            childPage = this.findByRegExp(pageInfo);
            break;
        case "string":
            childPage = this.findByURL(pageInfo);
            break;
        case "qtruntimeobject": // WebPage
            childPage = pageInfo;
            if (!utils.isWebPage(childPage) || !this.some(function(activePage) {
                return activePage.id === childPage.id;
            })) {
                throw new CasperError("Invalid or missing child page.");
            }
            break;
        default:
            throw new CasperError(f("Invalid pageInfo type: %s.", type));
    }
    return childPage;
};

/**
 * Finds the first child page which url matches a given RegExp.
 *
 * @param  RegExp  regexp
 * @return WebPage
 */
ChildPages.prototype.findByRegExp = function findByRegExp(regexp) {
    "use strict";
    var childPage = this.filter(function(activePage) {
        return regexp.test(activePage.url);
    })[0];
    if (!childPage) {
        throw new CasperError(f("Couldn't find child page with url matching pattern %s", regexp));
    }
    return childPage;
};

/**
 * Finds the first child page matching a given url.
 *
 * @param  String  url  The child WebPage url
 * @return WebPage
 */
ChildPages.prototype.findByURL = function findByURL(url) {
    "use strict";
    var childPage = this.filter(function(activePage) {
        return activePage.url === url;
    })[0];
    if (!childPage) {
        throw new CasperError(f("Couldn't find child page with url %s", url));
    }
    return childPage;
};
