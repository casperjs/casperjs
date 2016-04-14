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

/*global CasperError, exports, patchRequire, require:true*/

var require = patchRequire(require);
var utils = require('utils');

var Mouse = function Mouse(casper) {
    "use strict";
    if (!utils.isCasperObject(casper)) {
        throw new CasperError('Mouse() needs a Casper instance');
    }

    var slice = Array.prototype.slice,
        nativeEvents = ['mouseup', 'mousedown', 'click', 'mousemove'],
        nativeButtons = ['left', 'middle', 'right'];
    if (utils.gteVersion(phantom.version, '1.8.0')) {
        nativeEvents.push('doubleclick');
    }
    if (utils.gteVersion(phantom.version, '2.1.0')) {
        nativeEvents.push('contextmenu');
    }
    var emulatedEvents = ['mouseover', 'mouseout', 'mouseenter', 'mouseleave'],
        supportedEvents = nativeEvents.concat(emulatedEvents);

    var computeCenter = function computeCenter(selector) {
        var bounds = casper.getElementBounds(selector);
        if (utils.isClipRect(bounds)) {
            var x = Math.round(bounds.left + bounds.width / 2),
                y = Math.round(bounds.top + bounds.height / 2);
            return [x, y];
        }
        return [0, 0];
    };

    var getPointFromViewPort = function getPointFromViewPort(page, x, y){
        var px = x - x % page.viewportSize.width;
        var py = y - y % page.viewportSize.height;
        var max = casper.evaluate(function() {
                return [__utils__.getDocumentWidth(), __utils__.getDocumentHeight()];
            });
        if (py > max[0] - page.viewportSize.width && max[0] > page.viewportSize.width){
            px = max[0] - page.viewportSize.width;
        }
        if (py > max[1] - page.viewportSize.height && max[1] > page.viewportSize.height){
            py = max[1] - page.viewportSize.height;
        }
        page.scrollPosition = { 'left': px, 'top': py };
        return [ x - px, y - py ];
    };

    var getPointFromSelectorCoords = function getPointFromSelectorCoords(selector, clientX, clientY){
        var convertNumberToIntAndPercentToFloat = function convertNumberToIntAndPercentToFloat(a, def){
            return !!a && !isNaN(a) && parseInt(a, 10) ||
            !!a && !isNaN(parseFloat(a)) && parseFloat(a) >= 0 &&
              parseFloat(a) <= 100 && parseFloat(a) / 100 ||
            def;
        };
        var bounds = casper.getElementBounds(selector),
            px = convertNumberToIntAndPercentToFloat(clientX, 0.5),
            py = convertNumberToIntAndPercentToFloat(clientY, 0.5);

        if (utils.isClipRect(bounds)) {
            return [ bounds.left + (px ^ 0) + Math.round(bounds.width * (px - (px ^ 0)).toFixed(10)),
                     bounds.top + (py ^ 0) + Math.round(bounds.height * (py - (py ^ 0)).toFixed(10)) ];
        }
        return [1, 1];
    };

    var processEvent = function processEvent(type, args) {
        var button = nativeButtons[0], selector = 'html', index = 0, point,
            scroll = casper.page.scrollPosition;
        if (!utils.isString(type) || supportedEvents.indexOf(type) === -1) {
            throw new CasperError('Mouse.processEvent(): Unsupported mouse event type: ' + type);
        }
        if (emulatedEvents.indexOf(type) > -1) {
            casper.log("Mouse.processEvent(): no native fallback for type " + type, "warning");
        }
        args = [].slice.call(args); // cast Arguments -> Array
        if (args.length === 0) {
            throw new CasperError('Mouse.processEvent(): Too few arguments');
        }
        if (isNaN(parseInt(args[0], 10)) && casper.exists(args[0])) {
            selector = args[0];
            index++;
        }
        if (args.length >= index + 2) {
            point = getPointFromSelectorCoords(selector, args[index], args[index + 1]);
        } else {
            point = computeCenter(selector);
        }
        index = nativeButtons.indexOf(args[args.length - 1]);
        if (index > -1) {
            button = nativeButtons[index];
        }
        casper.emit('mouse.' + type.replace('mouse', ''), args);
        point = getPointFromViewPort(casper.page, point[0], point[1]);
        casper.page.sendEvent.apply(casper.page, [type].concat(point).concat([button]));
        casper.page.scrollPosition = scroll;
    };

    this.click = function click() {
        processEvent('click', arguments);
    };

    this.doubleclick = function doubleclick() {
        processEvent('doubleclick', arguments);
    };

    this.down = function down() {
        processEvent('mousedown', arguments);
    };

    this.move = function move() {
        processEvent('mousemove', arguments);
    };

    this.processEvent = function() {
        processEvent(arguments[0], [].slice.call(arguments, 1));
    };

    this.rightclick = function rightclick() {
        try {
            processEvent('contextmenu', arguments);
        } catch (e) {
            var args = slice.call(arguments);
        switch (args.length) {
                case 0:
                    throw new CasperError('Mouse.rightclick(): Too few arguments');
                case 1:
                    casper.mouseEvent('contextmenu', args[0]);
                    break;
                case 2:
                    if (!utils.isNumber(args[0]) || !utils.isNumber(args[1])) {
                       throw new CasperError('Mouse.rightclick(): No valid coordinates passed: ' + args);
                    }
                    var struct = casper.page.evaluate(function (clientX, clientY) {
                        var xpath = function xpath(el) {
                            if (typeof el === "string") {
                                return document.evaluate(el, document, null, 0, null);
                            }
                            if (!el || el.nodeType !== 1) {
                                return '';
                            }
                            if (el.id) {
                                return "//*[@id='" + el.id + "']";
                            }
                            var sames = [].filter.call(el.parentNode.children, function (x) {
                                return x.tagName === el.tagName;
                            });
                            return xpath(el.parentNode) + '/' + el.tagName.toLowerCase() +
                                (sames.length > 1 ? '[' + ([].indexOf.call(sames, el) + 1) + ']' : '');
                        };
                        try {
                           var elem = document.elementFromPoint(clientX, clientY);
                           var rec = elem.getBoundingClientRect();
                           return { "selector": {"type": "xpath", "path": xpath(elem)},
                                    "relX": clientX - rec.left, "relY": clientY - rec.top };
                        } catch (ex) {
                        return { "selector": {"type": "xpath", "path": "//html"},
                                 "relX": clientX, "relY": clientY };
                       }
                    }, args[0], args[1]);
                    casper.mouseEvent('contextmenu', struct.selector, struct.relX, struct.relY);
                    break;
                default:
                    throw new CasperError('Mouse.rightclick(): Too many arguments');
            }
        }
    };

    this.up = function up() {
        processEvent('mouseup', arguments);
    };
};

exports.create = function create(casper) {
    "use strict";
    return new Mouse(casper);
};

exports.Mouse = Mouse;
