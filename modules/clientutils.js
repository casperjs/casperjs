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

/*global escape, NodeList*/

(function(exports) {
    "use strict";

    exports.create = function create(options) {
        return new this.ClientUtils(options);
    };

    /**
     * Casper client-side helpers.
     */
    exports.ClientUtils = function ClientUtils(options) {
        /*eslint max-statements:0, no-multi-spaces:0*/
        // private members
        var BASE64_ENCODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var BASE64_DECODE_CHARS = [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
            52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
            -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
            -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
        ];
        var SUPPORTED_SELECTOR_TYPES = ['css', 'xpath'];
        var XPATH_NAMESPACE = {
            svg: 'http://www.w3.org/2000/svg',
            mathml: 'http://www.w3.org/1998/Math/MathML'
        };

        function form_urlencoded(str) {
            return encodeURIComponent(str)
                    .replace(/%20/g, '+')
                    .replace(/[!'()*]/g, function(c) {
                        return '%' + c.charCodeAt(0).toString(16);
                    });
        }

        // public members
        this.options = options || {};
        this.options.scope = this.options.scope || document;

        /**
         * Calls a method part of the current prototype, with arguments.
         *
         * @param  {String} method Method name
         * @param  {Array}  args   arguments
         * @return {Mixed}
         */
        this.__call = function __call(method, args) {
            if (method === "__call") {
                return;
            }
            try {
                return this[method].apply(this, args);
            } catch (err) {
                err.__isCallError = true;
                return err;
            }
        };

        /**
         * Clicks on the DOM element behind the provided selector.
         *
         * @param  String  selector  A CSS3 selector to the element to click
         * @param  {Number} x         X position
         * @param  {Number} y         Y position
         * @return Boolean
         */
        this.click = function click(selector, x, y) {
            return this.mouseEvent('click', selector, x, y);
        };

        /**
         * Decodes a base64 encoded string. Succeeds where window.atob() fails.
         *
         * @param  String  str  The base64 encoded contents
         * @return string
         */
        this.decode = function decode(str) {
            /*eslint max-statements:0, complexity:0 */
            var c1, c2, c3, c4, i = 0, len = str.length, out = "";
            while (i < len) {
                do {
                    c1 = BASE64_DECODE_CHARS[str.charCodeAt(i++) & 0xff];
                } while (i < len && c1 === -1);
                if (c1 === -1) {
                    break;
                }
                do {
                    c2 = BASE64_DECODE_CHARS[str.charCodeAt(i++) & 0xff];
                } while (i < len && c2 === -1);
                if (c2 === -1) {
                    break;
                }
                out += String.fromCharCode(c1 << 2 | (c2 & 0x30) >> 4);
                do {
                    c3 = str.charCodeAt(i++) & 0xff;
                    if (c3 === 61) {
                        return out;
                    }
                    c3 = BASE64_DECODE_CHARS[c3];
                } while (i < len && c3 === -1);
                if (c3 === -1) {
                    break;
                }
                out += String.fromCharCode((c2 & 0XF) << 4 | (c3 & 0x3C) >> 2);
                do {
                    c4 = str.charCodeAt(i++) & 0xff;
                    if (c4 === 61) {
                        return out;
                    }
                    c4 = BASE64_DECODE_CHARS[c4];
                } while (i < len && c4 === -1);
                if (c4 === -1) {
                    break;
                }
                out += String.fromCharCode((c3 & 0x03) << 6 | c4);
            }
            return out;
        };

        /**
         * Echoes something to casper console.
         *
         * @param  String  message
         * @return
         */
        this.echo = function echo(message) {
            console.log("[casper.echo] " + message);
        };

        /**
         * Checks if a given DOM element is visible in remote page.
         *
         * @param  Object   element  DOM element
         * @return Boolean
         */
        this.elementVisible = function elementVisible(elem) {
        var style;
        try {
            style = window.getComputedStyle(elem, null);
        } catch (e) {
            return false;
        }
            if(style.visibility === 'hidden' || style.display === 'none') return false;
            var cr = elem.getBoundingClientRect();
            return cr.width > 0 && cr.height > 0;
        };

        /**
         * Base64 encodes a string, even binary ones. Succeeds where
         * window.btoa() fails.
         *
         * @param  String  str  The string content to encode
         * @return string
         */
        this.encode = function encode(str) {
            /*eslint max-statements:0 */
            var out = "", i = 0, len = str.length, c1, c2, c3;
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i === len) {
                    out += BASE64_ENCODE_CHARS.charAt(c1 >> 2);
                    out += BASE64_ENCODE_CHARS.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i === len) {
                    out += BASE64_ENCODE_CHARS.charAt(c1 >> 2);
                    out += BASE64_ENCODE_CHARS.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
                    out += BASE64_ENCODE_CHARS.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += BASE64_ENCODE_CHARS.charAt(c1 >> 2);
                out += BASE64_ENCODE_CHARS.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
                out += BASE64_ENCODE_CHARS.charAt((c2 & 0xF) << 2 | (c3 & 0xC0) >> 6);
                out += BASE64_ENCODE_CHARS.charAt(c3 & 0x3F);
            }
            return out;
        };

        /**
         * Checks if a given DOM element exists in remote page.
         *
         * @param  String  selector  CSS3 selector
         * @return Boolean
         */
        this.exists = function exists(selector) {
            try {
                return this.findAll(selector).length > 0;
            } catch (e) {
                return false;
            }
        };

        /**
         * Fetches innerText within the element(s) matching a given CSS3
         * selector.
         *
         * @param  String  selector  A CSS3 selector
         * @return String
         */
        this.fetchText = function fetchText(selector) {
            var text = '', elements = this.findAll(selector);
            if (elements && elements.length) {
                Array.prototype.forEach.call(elements, function _forEach(element) {
                    text += element.textContent || element.innerText || element.value || '';
                });
            }
            return text;
        };

        /**
         * Fills a form with provided field values, and optionally submits it.
         *
         * @param  HTMLElement|String  form      A form element, or a CSS3 selector to a form element
         * @param  Object              vals      Field values
         * @param  String              findType  Element finder type (css, names, xpath, labels)
         * @return Object                        An object containing setting result for each field, including file uploads
         */
        this.fill = function fill(form, vals, findType) {
            findType = findType || "names";

            /*eslint complexity:0*/
            var out = {
                errors: [],
                fields: [],
                files: []
            };

            if (!(form instanceof HTMLElement) || typeof form === "string") {
                this.log("attempting to fetch form element from selector: '" + form + "'", "info");
                try {
                    form = this.findOne(form);
                } catch (e) {
                    if (e.name === "SYNTAX_ERR") {
                        out.errors.push("invalid form selector provided: '" + form + "'");
                        return out;
                    }
                }
            }

            if (!form) {
                out.errors.push("form not found");
                return out;
            }

            for (var fieldSelector in vals) {
                if (!vals.hasOwnProperty(fieldSelector)) {
                    continue;
                }
                try {
                    out.fields[fieldSelector] = this.setFieldValue(this.makeSelector(fieldSelector, findType), vals[fieldSelector], form);
                } catch (err) {
                    switch (err.name) {
                        case "FieldNotFound":
                            out.errors.push('Unable to find field element in form: ' + err.toString());
                        break;
                        case "FileUploadError":
                            out.files.push({
                                type: findType,
                                selector: findType === "labels" ? '#' + err.id : fieldSelector,
                                path: err.path
                            });
                        break;
                        default:
                            out.errors.push(err.toString());
                    }
                }
            }
            return out;
        };

        /**
         * Finds all DOM elements matching by the provided selector.
         *
         * @param  String | Object   selector  CSS3 selector (String only) or XPath object
         * @param  HTMLElement|null  scope     Element to search child elements within
         * @return Array|undefined
         */
        this.findAll = function findAll(selector, scope) {
            scope = scope instanceof HTMLElement ? scope : scope && this.findOne(scope) || this.options.scope;
            try {
                var pSelector = this.processSelector(selector);
                if (pSelector.type === 'xpath') {
                    return this.getElementsByXPath(pSelector.path, scope);
                } else {
                    return Array.prototype.slice.call(scope.querySelectorAll(pSelector.path));
                }
            } catch (e) {
                this.log('findAll(): invalid selector provided "' + selector + '":' + e, "error");
            }
        };

        /**
         * Finds a DOM element by the provided selector.
         *
         * @param  String | Object   selector  CSS3 selector (String only) or XPath object
         * @param  HTMLElement|null  scope     Element to search child elements within
         * @return HTMLElement|undefined
         */
        this.findOne = function findOne(selector, scope) {
            scope = scope instanceof HTMLElement ? scope : scope && this.findOne(scope) || this.options.scope;
            try {
                var pSelector = this.processSelector(selector);
                if (pSelector.type === 'xpath') {
                    return this.getElementByXPath(pSelector.path, scope);
                } else {
                    return scope.querySelector(pSelector.path);
                }
            } catch (e) {
                this.log('findOne(): invalid selector provided "' + selector + '":' + e, "error");
            }
        };

        /**
         * Force target on <FORM> and <A> tag.
         *
         * @param  String     selector  CSS3 selector
         * @param  String     A HTML target '_blank','_self','_parent','_top','framename'
         * @return Boolean
         */
        this.forceTarget = function forceTarget(selector, target) {
            var elem = this.findOne(selector);
            while (!!elem && elem.tagName !== 'A' &&  elem.tagName !== 'FORM' && elem.tagName !== 'BODY'){
                elem = elem.parentNode;
            }
            if (elem === 'A' || elem === 'FORM') {
                elem.setAttribute('target', target);
                return true;
            }
            return false;
        };

        /**
         * Downloads a resource behind an url and returns its base64-encoded
         * contents.
         *
         * @param  String  url     The resource url
         * @param  String  method  The request method, optional (default: GET)
         * @param  Object  data    The request data, optional
         * @return String          Base64 contents string
         */
        this.getBase64 = function getBase64(url, method, data) {
            return this.encode(this.getBinary(url, method, data));
        };

        /**
         * Retrieves string contents from a binary file behind an url. Silently
         * fails but log errors.
         *
         * @param   String   url     Url.
         * @param   String   method  HTTP method.
         * @param   Object   data    Request parameters.
         * @return  String
         */
        this.getBinary = function getBinary(url, method, data) {
            try {
                return this.sendAJAX(url, method, data, false, {
                    overrideMimeType: "text/plain; charset=x-user-defined"
                });
            } catch (e) {
                if (e.name === "NETWORK_ERR" && e.code === 101) {
                    this.log("getBinary(): Unfortunately, casperjs cannot make"
                        + " cross domain ajax requests", "warning");
                }
                this.log("getBinary(): Error while fetching " + url + ": " + e, "error");
                return "";
            }
        };


        /**
         * Convert a Xpath or a css Selector into absolute css3 selector
         *
         * @param  String|Object     selector    CSS3/XPath selector
         * @param  HTMLElement|null  scope       Element to search child elements within
         * @param  String            limit       Parent limit NodeName
         * @return String
         */

        this.getCssSelector = function getCssSelector(selector, scope, limit) {
            scope = scope || this.options.scope;
            limit = limit || 'BODY';
            var elem = (selector instanceof Node) ? selector : this.findOne(selector, scope);
            if (!!elem && elem.nodeName !== "#document") {
                var str = "";
                while (elem.nodeName.toUpperCase() !== limit.toUpperCase()) {
                    str = "> " + elem.nodeName + ':nth-child(' + ([].indexOf.call(elem.parentNode.children, elem) + 1) + ') ' + str;
                    elem = elem.parentNode;
                }
                return str.substring(2);
            }
            return "";
        };
        
        /**
         * Retrieves total document height.
         * http://james.padolsey.com/javascript/get-document-height-cross-browser/
         *
         * @return {Number}
         */
        this.getDocumentHeight = function getDocumentHeight() {
            return Math.max(
                Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
                Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
                Math.max(document.body.clientHeight, document.documentElement.clientHeight)
            );
        };

        /**
         * Retrieves total document width.
         * http://james.padolsey.com/javascript/get-document-width-cross-browser/
         *
         * @return {Number}
         */
        this.getDocumentWidth = function getDocumentWidth() {
            return Math.max(
                Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),
                Math.max(document.body.clientWidth, document.documentElement.clientWidth)
            );
        };

        /**
         * Retrieves bounding rect coordinates of the HTML element matching the
         * provided CSS3 selector in the following form:
         *
         * {top: y, left: x, width: w, height:, h}
         *
         * @param  String  selector
         * @return Object or null
         */
        this.getElementBounds = function getElementBounds(selector) {
            try {
                var clipRect = this.findOne(selector).getBoundingClientRect();
                return {
                    top: clipRect.top,
                    left: clipRect.left,
                    width: clipRect.width,
                    height: clipRect.height
                };
            } catch (e) {
                this.log("Unable to fetch bounds for element " + selector, "warning");
            }
        };

        /**
         * Retrieves the list of bounding rect coordinates for all the HTML elements matching the
         * provided CSS3 selector, in the following form:
         *
         * [{top: y, left: x, width: w, height:, h},
         *  {top: y, left: x, width: w, height:, h},
         *  ...]
         *
         * @param  String  selector
         * @return Array
         */
        this.getElementsBounds = function getElementsBounds(selector) {
            var elements = this.findAll(selector);
            try {
                return Array.prototype.map.call(elements, function(element) {
                    var clipRect = element.getBoundingClientRect();
                    return {
                        top: clipRect.top,
                        left: clipRect.left,
                        width: clipRect.width,
                        height: clipRect.height
                    };
                });
            } catch (e) {
                this.log("Unable to fetch bounds for elements matching " + selector, "warning");
            }
        };

        /**
         * Retrieves information about the node matching the provided selector.
         *
         * @param  String|Object  selector  CSS3/XPath selector
         * @return Object
         */
        this.getElementInfo = function getElementInfo(selector) {
            var element = this.findOne(selector);
            var bounds = this.getElementBounds(selector);
            var attributes = {};
            [].forEach.call(element.attributes, function(attr) {
                attributes[attr.name.toLowerCase()] = attr.value;
            });
            return {
                nodeName: element.nodeName.toLowerCase(),
                attributes: attributes,
                tag: element.outerHTML,
                html: element.innerHTML,
                text: element.textContent || element.innerText,
                x: bounds.left,
                y: bounds.top,
                width: bounds.width,
                height: bounds.height,
                visible: this.visible(selector)
            };
        };

        /**
         * Retrieves information about the nodes matching the provided selector.
         *
         * @param  String|Object  selector  CSS3/XPath selector
         * @return Array
         */
        this.getElementsInfo = function getElementsInfo(selector) {
            var bounds = this.getElementsBounds(selector);
            var eleVisible = this.elementVisible;
            return [].map.call(this.findAll(selector), function(element, index) {
                var attributes = {};
                [].forEach.call(element.attributes, function(attr) {
                    attributes[attr.name.toLowerCase()] = attr.value;
                });
                return {
                    nodeName: element.nodeName.toLowerCase(),
                    attributes: attributes,
                    tag: element.outerHTML,
                    html: element.innerHTML,
                    text: element.textContent || element.innerText,
                    x: bounds[index].left,
                    y: bounds[index].top,
                    width: bounds[index].width,
                    height: bounds[index].height,
                    visible: eleVisible(element)
                };
            });
        };

        /**
         * Retrieves a single DOM element matching a given XPath expression.
         *
         * @param  String            expression  The XPath expression
         * @param  HTMLElement|null  scope       Element to search child elements within
         * @return HTMLElement or null
         */
        this.getElementByXPath = function getElementByXPath(expression, scope) {
            scope = scope || this.options.scope;
            var a = document.evaluate(expression, scope, this.xpathNamespaceResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            if (a.snapshotLength > 0) {
                return a.snapshotItem(0);
            }
        };

        /**
         * Retrieves all DOM elements matching a given XPath expression.
         *
         * @param  String            expression  The XPath expression
         * @param  HTMLElement|null  scope       Element to search child elements within
         * @return Array
         */
        this.getElementsByXPath = function getElementsByXPath(expression, scope) {
            scope = scope || this.options.scope;
            var nodes = [];
            var a = document.evaluate(expression, scope, this.xpathNamespaceResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < a.snapshotLength; i++) {
                nodes.push(a.snapshotItem(i));
            }
            return nodes;
        };

        /**
         * Build the xpath namespace resolver to evaluate on document
         *
         * @param String        prefix   The namespace prefix
         * @return the resolve namespace or null
         */
        this.xpathNamespaceResolver = function xpathNamespaceResolver(prefix) {
          return XPATH_NAMESPACE[prefix] || null;
        };

        /**
         * Retrieves the value of an element
         *
         * @param  String  inputName  The for input name attr value
         * @param  Object  options    Object with formSelector, optional
         * @return Mixed
         */
        this.getFieldValue = function getFieldValue(selector, scope) {
            var self = this;
            var fields = this.findAll(selector, scope);
            var type;

            // for Backward Compatibility
            if (!(fields instanceof NodeList || fields instanceof Array)) {
                this.log("attempting to fetch field element from selector: '" + selector + "'", "info");
                fields = this.findAll('[name="' + selector + '"]');
            }

            if (fields && fields.length > 1) {
                type = fields[0].hasAttribute('type') ? fields[0].getAttribute('type') : "other";
                fields = [].filter.call(fields, function(elm){
                    if (elm.nodeName.toLowerCase() === 'input' &&
                        ['checkbox', 'radio'].indexOf(elm.getAttribute('type')) !== -1) {
                        return elm.checked;
                    }
                    return true;
                });
            }

            if (fields.length === 0 ) {
                return type !== "radio" ? [] : undefined;
            }

            if (fields.length > 1 ) {
                return [].map.call(fields, function(elm) {
                    var ret = self.getField(elm);
                    return ret && type === 'checkbox' ? elm.value : ret;
                });
            }

            return this.getField(fields[0]);
        };

        /**
         * Retrieves the value of a form field.
         *
         * @param  HTMLElement  An html element
         * @return Mixed
         */
        this.getField = function getField(field) {
            var nodeName, type;

            if (!(field instanceof HTMLElement)) {
                var error = new Error('getFieldValue: Invalid field ; only HTMLElement is supported');
                error.name = 'FieldNotFound';
                throw error;
            }

            nodeName = field.nodeName.toLowerCase();
            type = field.hasAttribute('type') ? field.getAttribute('type').toLowerCase() : 'text';
            if (nodeName === "select" && field.multiple) {
                return [].filter.call(field.options, function(option){
                    return !!option.selected;
                }).map(function(option){
                    return option.value || option.text;
                });
            }
            if (type === 'radio') {
                return field.checked ? field.value : null;
            }
            if (type === 'checkbox') {
                return field.checked;
            }
            return field.value || '';
        };

        /**
         * Retrieves a given form all of its field values.
         *
         * @param  HTMLElement|String  form      A form element, or a CSS3 selector to a form element
         * @return Object
         */
        this.getFormValues = function getFormValues(form) {
            var self = this;
            var values = {}, checked = {};

            if (!(form instanceof HTMLElement) || typeof form === "string") {
                this.log("attempting to fetch form element from selector: '" + form + "'", "info");
                try {
                    form = this.findOne(form);
                } catch (e) {
                    this.log("invalid form selector provided: '" + form + "'");
                    return {};
                }
            }

            [].forEach.call(form.elements, function(elm) {
                var name = elm.getAttribute('name');
                var value = self.getField(elm);
                var multi = !!value && elm.hasAttribute('type') &&
                            elm.type === 'checkbox' ? elm.value : value;
                if (!!name && value !== null && !(elm.type === 'checkbox' && value === false)) {
                    if (typeof values[name] === "undefined") {
                        values[name] = value;
                        checked[name] = multi;
                    } else {
                        if (!Array.isArray(values[name])) {
                            values[name] = [checked[name]];
                        }
                        values[name].push(multi);
                    }
                }
            });
            return values;
        };

        /**
         * Logs a message. Will format the message a way CasperJS will be able
         * to log phantomjs side.
         *
         * @param  String  message  The message to log
         * @param  String  level    The log level
         */
        this.log = function log(message, level) {
            console.log("[casper:" + (level || "debug") + "] " + message);
        };

        /**
         * Makes selector by defined type XPath, Name or Label. Function has same result as selectXPath in Casper module for
         * XPath type - it makes XPath object.
         * Function also accepts name attribut of the form filed or can select element by its label text.
         *
         * @param  String selector Selector of defined type
         * @param  String|null  type Type of selector, it can have these values:
         *         css - CSS3 selector - selector is returned trasparently
         *         xpath - XPath selector - return XPath object
         *         name|names - select input of specific name, internally covert to CSS3 selector
         *         label|labels - select input of specific label, internally covert to XPath selector. As selector is label's text used.
         * @return String|Object
         */
        this.makeSelector = function makeSelector(selector, type){
            type = type || 'xpath'; // default type
            var ret;

            if (typeof selector === "object") { // selector object (CSS3 | XPath) could by passed
                selector = selector.path;
            }

            switch (type) {
                case 'css': // do nothing
                    ret = selector;
                    break;
                case 'name': // convert to css
                case 'names':
                    ret = '[name="' + selector + '"]';
                    break;
                case 'label': // covert to xpath object
                case 'labels':
                    ret = {type: 'xpath', path: '//*[@id=string(//label[text()="' + selector + '"]/@for)]'};
                    break;
                case 'xpath': // covert to xpath object
                    ret = {type: 'xpath', path: selector};
                    break;
                default:
                    throw new Error("Unsupported selector type: " + type);
            }

            return ret;
        };

        /**
         * Dispatches a mouse event to the DOM element behind the provided selector.
         *
         * @param  String   type      Type of event to dispatch
         * @param  String   selector  A CSS3 selector to the element to click
         * @param  {Number} x         X position
         * @param  {Number} y         Y position
         * @return Boolean
         */
        this.mouseEvent = function mouseEvent(type, selector, x, y) {
            var elem = this.findOne(selector);
            if (!elem || ( !this.elementVisible(elem) && elem.nodeName.toUpperCase() !== "AREA")) {
                this.log("mouseEvent(): Couldn't find any element matching '" +
                    selector + "' selector", "error");
                return false;
            }

            var convertNumberToIntAndPercentToFloat = function (a, def){
                return !!a && !isNaN(a) && parseInt(a, 10) ||
                    !!a && !isNaN(parseFloat(a)) && parseFloat(a) >= 0 &&
                    parseFloat(a) <= 100 && parseFloat(a) / 100 ||
                def;
            };
            try {
                var evt = document.createEvent("MouseEvents");
                var px = convertNumberToIntAndPercentToFloat(x, 0.5),
                    py = convertNumberToIntAndPercentToFloat(y, 0.5);
                try {
                    var bounds = elem.getBoundingClientRect();
                    px = Math.floor(bounds.width  * (px - (px ^ 0)).toFixed(10)) + (px ^ 0) + bounds.left;
                    py = Math.floor(bounds.height * (py - (py ^ 0)).toFixed(10)) + (py ^ 0) + bounds.top;
                } catch (e) {
                    px = 1; py = 1;
                }
                evt.initMouseEvent(type, true, true, window, 1, 1, 1, px, py, false, false, false, false,
                    type !== "contextmenu" ? 0 : 2, elem);
                // dispatchEvent return value is false if at least one of the event
                // handlers which handled this event called preventDefault;
                // so we cannot returns this results as it cannot accurately informs on the status
                // of the operation
                // let's assume the event has been sent ok it didn't raise any error
                elem.dispatchEvent(evt);
                return true;
            } catch (e) {
                this.log("Failed dispatching " + type + "mouse event on " + selector + ": " + e, "error");
                return false;
            }
        };

        /**
         * Processes a selector input, either as a string or an object.
         *
         * If passed an object, if must be of the form:
         *
         *     selectorObject = {
         *         type: <'css' or 'xpath'>,
         *         path: <a string>
         *     }
         *
         * @param  String|Object  selector  The selector string or object
         *
         * @return an object containing 'type' and 'path' keys
         */
        this.processSelector = function processSelector(selector) {
            var selectorObject = {
                toString: function toString() {
                    return this.type + ' selector: ' + this.path;
                }
            };
            if (typeof selector === "string") {
                // defaults to CSS selector
                selectorObject.type = "css";
                selectorObject.path = selector;
                return selectorObject;
            } else if (typeof selector === "object") {
                // validation
                if (!selector.hasOwnProperty('type') || !selector.hasOwnProperty('path')) {
                    throw new Error("Incomplete selector object");
                } else if (SUPPORTED_SELECTOR_TYPES.indexOf(selector.type) === -1) {
                    throw new Error("Unsupported selector type: " + selector.type);
                }
                if (!selector.hasOwnProperty('toString')) {
                    selector.toString = selectorObject.toString;
                }
                return selector;
            }
            throw new Error("Unsupported selector type: " + typeof selector);
        };

        /**
         * Removes all DOM elements matching a given XPath expression.
         *
         * @param  String  expression  The XPath expression
         * @return Array
         */
        this.removeElementsByXPath = function removeElementsByXPath(expression) {
            var a = document.evaluate(expression, document, null,
                XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < a.snapshotLength; i++) {
                a.snapshotItem(i).parentNode.removeChild(a.snapshotItem(i));
            }
        };

        /**
         * Scrolls current document to x, y coordinates.
         *
         * @param  {Number} x X position
         * @param  {Number} y Y position
         */
        this.scrollTo = function scrollTo(x, y) {
            window.scrollTo(parseInt(x || 0, 10), parseInt(y || 0, 10));
        };

        /**
         * Scrolls current document up to its bottom.
         */
        this.scrollToBottom = function scrollToBottom() {
            this.scrollTo(0, this.getDocumentHeight());
        };

        /**
         * Performs an AJAX request.
         *
         * @param   String   url      Url.
         * @param   String   method   HTTP method (default: GET).
         * @param   Object   data     Request parameters.
         * @param   Boolean  async    Asynchroneous request? (default: false)
         * @param   Object   settings Other settings when perform the ajax request like some undocumented
         * Request Headers.
         * WARNING: an invalid header here may make the request fail silently.
         * @return  String            Response text.
         */
        this.sendAJAX = function sendAJAX(url, method, data, async, settings) {
            var xhr = new XMLHttpRequest(),
                dataString = "",
                dataList = [];
            var CONTENT_TYPE_HEADER = "Content-Type";
            method = method && method.toUpperCase() || "GET";
            var contentTypeValue = settings && settings.contentType || "application/x-www-form-urlencoded";
            xhr.open(method, url, !!async);
            this.log("sendAJAX(): Using HTTP method: '" + method + "'", "debug");
            if (settings && settings.overrideMimeType) {
                xhr.overrideMimeType(settings.overrideMimeType);
            }
            if (settings && settings.headers) {
               for (var header in settings.headers) {
                   if (header === CONTENT_TYPE_HEADER) {
                      // this way Content-Type is correctly overriden,
                      // otherwise it is concatenated by xhr.setRequestHeader()
                      // see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
                      // If the header was already set, the value will be augmented.
                       contentTypeValue = settings.headers[header];
                   } else {
                       xhr.setRequestHeader(header, settings.headers[header]);
                   }
              }
            }
            if (method === "POST") {
                if (typeof data === "object") {
                    for (var k in data) {
                        if (data.hasOwnProperty(k)) {
                            dataList.push(form_urlencoded(k) + "=" +
                             form_urlencoded(data[k].toString()));
                        }
                    }
                    dataString = dataList.join('&');
                    this.log("sendAJAX(): Using request data: '" + dataString + "'", "debug");
                } else if (typeof data === "string") {
                    dataString = data;
                }
                xhr.setRequestHeader(CONTENT_TYPE_HEADER, contentTypeValue);
            }
            xhr.send(method === "POST" ? dataString : null);
            return xhr.responseText;
        };

        /**
         * Sets a value to form element by CSS3 or XPath selector.
         *
         * With makeSelector() helper can by easily used with name or label selector
         *     @exemple setFieldValue(this.makeSelector('email', 'name'), 'value')
         *
         * @param String|Object            CSS3|XPath selector
         * @param Mixed                    Input value
         * @param HTMLElement|String|null  scope Element to search child elements within
         * @return bool
         */
        this.setFieldValue = function setFieldValue(selector, value, scope) {
            var self = this;
            var fields = this.findAll(selector, scope);
            var values = value;

            if (!Array.isArray(value)) {
                values = [value];
            }

            if (fields && fields.length > 1) {
                fields = [].filter.call(fields, function(elm){
                    if (elm.nodeName.toLowerCase() === 'input' &&
                        ['checkbox', 'radio'].indexOf(elm.getAttribute('type')) !== -1) {
                        return values.indexOf(elm.getAttribute('value')) !== -1;
                    }
                    return true;
                });
                [].forEach.call(fields, function(elm) {
                    self.setField(elm, value);
                });
            } else {
                this.setField(fields[0], value);
            }
            return true;
        };

        /**
         * Sets a field value. Fails silently, but log
         * error messages.
         *
         * @param  HTMLElement  field  One element defining a field
         * @param  mixed        value  The field value to set
         */
        this.setField = function setField(field, value) {
            /*eslint complexity:0*/
            var logValue, out, filter;
            value = logValue = value || "";

            if (!(field instanceof HTMLElement)) {
                var error = new Error('setField: Invalid field ; only HTMLElement is supported');
                error.name = 'FieldNotFound';
                throw error;
            }

            if (this.options && this.options.safeLogs && field.getAttribute('type') === "password") {
                // obfuscate password value
                logValue = new Array(('' + value).length + 1).join("*");
            }
            this.log('Set "' + field.getAttribute('name') + '" field value to ' + logValue, "debug");

            try {
                field.focus();
            } catch (e) {
                this.log("Unable to focus() input field " + field.getAttribute('name') + ": " + e, "warning");
            }

            filter = String(field.getAttribute('type') ? field.getAttribute('type') : field.nodeName).toLowerCase();
            switch (filter) {
                case "checkbox":
                case "radio":
                    field.checked = value ? true : false;
                    break;
                case "file":
                    throw {
                        name: "FileUploadError",
                        message: "File field must be filled using page.uploadFile",
                        path: value,
                        id: field.id || null
                    };
                    break;
                case "select":
                    if (field.multiple) {
                        [].forEach.call(field.options, function(option) {
                            option.selected = value.indexOf(option.value) !== -1;
                        });
                        // If the values can't be found, try search options text
                        if (field.value === "") {
                            [].forEach.call(field.options, function(option) {
                                option.selected = value.indexOf(option.text) !== -1;
                            });
                        }
                    } else {
                        // PhantomJS 1.x.x can't handle setting value to ''
                        if (value === "") {
                            field.selectedIndex = -1;
                        } else {
                            field.value = value;
                        }

                        // If the value can't be found, try search options text
                        if (field.value !== value) {
                            [].some.call(field.options, function(option) {
                                option.selected = value === option.text;
                                return value === option.text;
                            });
                        }
                    }
                    break;
                default:
                    field.value = value;
            }

            ['change', 'input'].forEach(function(name) {
                var event = document.createEvent("HTMLEvents");
                event.initEvent(name, true, true);
                field.dispatchEvent(event);
            });

            // blur the field
            try {
                field.blur();
            } catch (err) {
                this.log("Unable to blur() input field " + field.getAttribute('name') +
                 ": " + err, "warning");
            }
            return out;
        };

        /**
         * set the default scope selector
         *
         * @param  String  selector  CSS3 selector
         * @return String
         */
        this.setScope = function setScope(selector) {
            var scope = !(this.options.scope instanceof HTMLElement) ? this.getCssSelector(this.options.scope) : "";
            this.options.scope = (selector !== "") ? this.findOne(selector) : document;
            return scope;
        };

        /**
         * Checks if any element matching a given selector is visible in remote page.
         *
         * @param  String  selector  CSS3 selector
         * @return Boolean
         */
        this.visible = function visible(selector) {
            return [].some.call(this.findAll(selector), this.elementVisible);
        };

        /**
         * Checks if all elements matching a given selector are visible in remote page.
         *
         * @param  String  selector  CSS3 selector
         * @return Boolean
         */
        this.allVisible = function allVisible(selector) {
            return [].every.call(this.findAll(selector), this.elementVisible);
        };
    };
})(typeof exports ===  "object" && !(exports instanceof Element) ? exports : window);
