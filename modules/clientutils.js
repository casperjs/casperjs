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
(function(exports) {
    exports.create = function() {
        return new ClientUtils();
    };

    /**
     * Casper client-side helpers.
     */
    ClientUtils = function() {
        var BASE64_ENCODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var BASE64_DECODE_CHARS = new Array(
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
            52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
            -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
            -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
        );

        /**
         * Clicks on the DOM element behind the provided selector.
         *
         * @param  String  selector        A CSS3 selector to the element to click
         * @return Boolean
         */
        this.click = function(selector) {
            var elem = this.findOne(selector);
            if (!elem) {
                this.log("click(): Couldn't find any element matching '" + selector + "' selector", "error");
                return false;
            }
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", true, true, window, 1, 1, 1, 1, 1, false, false, false, false, 0, elem);
            // dispatchEvent return value is false if at least one of the event
            // handlers which handled this event called preventDefault
            return elem.dispatchEvent(evt);
        };

        /**
         * Decodes a base64 encoded string. Succeeds where window.atob() fails.
         *
         * @param  String  str  The base64 encoded contents
         * @return string
         */
        this.decode = function(str) {
            var c1, c2, c3, c4, i = 0, len = str.length, out = "";
            while (i < len) {
                do {
                    c1 = BASE64_DECODE_CHARS[str.charCodeAt(i++) & 0xff];
                } while (i < len && c1 == -1);
                if (c1 == -1) {
                    break;
                }
                do {
                    c2 = BASE64_DECODE_CHARS[str.charCodeAt(i++) & 0xff];
                } while (i < len && c2 == -1);
                if (c2 == -1) {
                    break;
                }
                out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
                do {
                    c3 = str.charCodeAt(i++) & 0xff;
                    if (c3 == 61)
                    return out;
                    c3 = BASE64_DECODE_CHARS[c3];
                } while (i < len && c3 == -1);
                if (c3 == -1) {
                    break;
                }
                out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
                do {
                    c4 = str.charCodeAt(i++) & 0xff;
                    if (c4 == 61) {
                        return out;
                    }
                    c4 = BASE64_DECODE_CHARS[c4];
                } while (i < len && c4 == -1);
                if (c4 == -1) {
                    break;
                }
                out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
            }
            return out;
        };

        /**
         * Base64 encodes a string, even binary ones. Succeeds where
         * window.btoa() fails.
         *
         * @param  String  str  The string content to encode
         * @return string
         */
        this.encode = function(str) {
            var out = "", i = 0, len = str.length, c1, c2, c3;
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    out += BASE64_ENCODE_CHARS.charAt(c1 >> 2);
                    out += BASE64_ENCODE_CHARS.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    out += BASE64_ENCODE_CHARS.charAt(c1 >> 2);
                    out += BASE64_ENCODE_CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                    out += BASE64_ENCODE_CHARS.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += BASE64_ENCODE_CHARS.charAt(c1 >> 2);
                out += BASE64_ENCODE_CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += BASE64_ENCODE_CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
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
        this.exists = function(selector) {
            try {
                return document.querySelectorAll(selector).length > 0;
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
        this.fetchText = function(selector) {
            var text = '', elements = this.findAll(selector);
            if (elements && elements.length) {
                Array.prototype.forEach.call(elements, function(element) {
                    text += element.innerText;
                });
            }
            return text;
        };

        /**
         * Fills a form with provided field values, and optionnaly submits it.
         *
         * @param  HTMLElement|String  form    A form element, or a CSS3 selector to a form element
         * @param  Object              vals    Field values
         * @return Object                      An object containing setting result for each field, including file uploads
         */
        this.fill = function(form, vals) {
            var out = {
                errors: [],
                fields: [],
                files:  []
            };
            if (!(form instanceof HTMLElement) || typeof form === "string") {
                __utils__.log("attempting to fetch form element from selector: '" + form + "'", "info");
                try {
                    form = document.querySelector(form);
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
            for (var name in vals) {
                if (!vals.hasOwnProperty(name)) {
                    continue;
                }
                var field = form.querySelectorAll('[name="' + name + '"]');
                var value = vals[name];
                if (!field) {
                    out.errors.push('no field named "' + name + '" in form');
                    continue;
                }
                try {
                    out.fields[name] = this.setField(field, value);
                } catch (err) {
                    if (err.name === "FileUploadError") {
                        out.files.push({
                            name: name,
                            path: err.path
                        });
                    } else {
                        this.log(err, "error");
                        throw err;
                    }
                }
            }
            return out;
        };

        /**
         * Finds all DOM elements matching by the provided selector.
         *
         * @param  String  selector  CSS3 selector
         * @return NodeList|undefined
         */
        this.findAll = function(selector) {
            try {
                return document.querySelectorAll(selector);
            } catch (e) {
                this.log('findAll(): invalid selector provided "' + selector + '":' + e, "error");
            }
        };

        /**
         * Finds a DOM element by the provided selector.
         *
         * @param  String  selector  CSS3 selector
         * @return HTMLElement|undefined
         */
        this.findOne = function(selector) {
            try {
                return document.querySelector(selector);
            } catch (e) {
                this.log('findOne(): invalid selector provided "' + selector + '":' + e, "errors");
            }
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
        this.getBase64 = function(url, method, data) {
            return this.encode(this.getBinary(url, method, data));
        };

        /**
         * Retrieves string contents from a binary file behind an url. Silently
         * fails but log errors.
         *
         * @param  String  url
         * @param  String  method
         * @param  Object  data
         * @return string
         */
        this.getBinary = function(url, method, data) {
            try {
                var xhr = new XMLHttpRequest(), dataString = "";
                if (typeof method !== "string" || ["GET", "POST"].indexOf(method.toUpperCase()) === -1) {
                    method = "GET";
                } else {
                    method = method.toUpperCase();
                }
                xhr.open(method, url, false);
                this.log("getBinary(): Using HTTP method: '" + method + "'", "debug");
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
                if (method === "POST") {
                    if (typeof data === "object") {
                        var dataList = [];
                        for (var k in data) {
                            dataList.push(escape(k) + "=" + escape(data[k].toString()));
                        }
                        dataString = dataList.join('&');
                        this.log("getBinary(): Using request data: '" + dataString + "'", "debug");
                    }
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                }
                xhr.send(method === "POST" ? dataString : null);
                return xhr.responseText;
            } catch (e) {
                if (e.name === "NETWORK_ERR" && e.code === 101) {
                    this.log("getBinary(): Unfortunately, casperjs cannot make cross domain ajax requests", "warning");
                }
                this.log("getBinary(): Error while fetching " + url + ": " + e, "error");
                return "";
            }
        };

        /**
         * Retrieves bounding rect coordinates of the HTML element matching the
         * provided CSS3 selector
         *
         * @param  String  selector
         * @return Object or null
         */
        this.getElementBounds = function(selector) {
            try {
                var clipRect = document.querySelector(selector).getBoundingClientRect();
                return {
                    top:    clipRect.top,
                    left:   clipRect.left,
                    width:  clipRect.width,
                    height: clipRect.height
                };
            } catch (e) {
                this.log("Unable to fetch bounds for element " + selector, "warning");
            }
        };

        /**
         * Logs a message. Will format the message a way CasperJS will be able
         * to log phantomjs side.
         *
         * @param  String  message  The message to log
         * @param  String  level    The log level
         */
        this.log = function(message, level) {
            console.log("[casper:" + (level || "debug") + "] " + message);
        };

        /**
         * Sets a field (or a set of fields) value. Fails silently, but log
         * error messages.
         *
         * @param  HTMLElement|NodeList  field  One or more element defining a field
         * @param  mixed                 value  The field value to set
         */
        this.setField = function(field, value) {
            var fields, out;
            value = value || "";
            if (field instanceof NodeList) {
                fields = field;
                field = fields[0];
            }
            if (!field instanceof HTMLElement) {
                this.log("Invalid field type; only HTMLElement and NodeList are supported", "error");
            }
            this.log('Set "' + field.getAttribute('name') + '" field value to ' + value, "debug");
            try {
                field.focus();
            } catch (e) {
                __utils__.log("Unable to focus() input field " + field.getAttribute('name') + ": " + e, "warning");
            }
            var nodeName = field.nodeName.toLowerCase();
            switch (nodeName) {
                case "input":
                    var type = field.getAttribute('type') || "text";
                    switch (type.toLowerCase()) {
                        case "color":
                        case "date":
                        case "datetime":
                        case "datetime-local":
                        case "email":
                        case "hidden":
                        case "month":
                        case "number":
                        case "password":
                        case "range":
                        case "search":
                        case "tel":
                        case "text":
                        case "time":
                        case "url":
                        case "week":
                            field.value = value;
                            break;
                        case "checkbox":
                            if (fields.length > 1) {
                                var values = value;
                                if (!Array.isArray(values)) {
                                    values = [values];
                                }
                                Array.prototype.forEach.call(fields, function(f) {
                                    f.checked = values.indexOf(f.value) !== -1 ? true : false;
                                });
                            } else {
                                field.checked = value ? true : false;
                            }
                            break;
                        case "file":
                            throw {
                                name:    "FileUploadError",
                                message: "File field must be filled using page.uploadFile",
                                path:    value
                            };
                        case "radio":
                            if (fields) {
                                Array.prototype.forEach.call(fields, function(e) {
                                    e.checked = (e.value === value);
                                });
                            } else {
                                out = 'Urovided radio elements are empty';
                            }
                            break;
                        default:
                            out = "Unsupported input field type: " + type;
                            break;
                    }
                    break;
                case "select":
                case "textarea":
                    field.value = value;
                    break;
                default:
                    out = 'Unsupported field type: ' + nodeName;
                    break;
            }
            try {
                field.blur();
            } catch (err) {
                __utils__.log("Unable to blur() input field " + field.getAttribute('name') + ": " + err, "warning");
            }
            return out;
        };

        /**
         * Checks if a given DOM element is visible in remote page.
         *
         * @param  String  selector  CSS3 selector
         * @return Boolean
         */
        this.visible = function(selector) {
            try {
                var el = document.querySelector(selector);
                return el && el.style.visibility !== 'hidden' && el.offsetHeight > 0 && el.offsetWidth > 0;
            } catch (e) {
                return false;
            }
        };
    };
    exports.ClientUtils = ClientUtils;

    // silly "hack" to force having an instance available
    exports.__utils__ = new exports.ClientUtils();
})(typeof exports === "object" ? exports : window);
