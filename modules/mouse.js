/*!
 * Casper is a navigation utility for PhantomJS.
 *
 * Documentation: http://n1k0.github.com/casperjs/
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

var utils = require('utils');

exports.create = function(casper) {
    return new Mouse(casper);
};

var Mouse = function(casper) {
    if (!utils.isCasperObject(casper)) {
        throw new Error('Mouse() needs a Casper instance');
    }

    var supportedEvents = ['mouseup', 'mousedown', 'click', 'mousemove'];

    var computeCenter = function(selector) {
        var bounds = casper.getElementBounds(selector);
        if (utils.isClipRect(bounds)) {
            var x = Math.round(bounds.left + bounds.width / 2);
            var y = Math.round(bounds.top  + bounds.height / 2);
            return [x, y];
        }
    };

    var processEvent = function(type, args) {
        if (!utils.isString(type) || supportedEvents.indexOf(type) === -1) {
            throw new Error('Unsupported mouse event type: ' + type);
        }
        args = Array.prototype.slice.call(args); // cast Arguments -> Array
        casper.emit('mouse.' + type.replace('mouse', ''), args);
        switch (args.length) {
            case 0:
                throw new Error('Too few arguments');
            case 1:
                // selector
                var selector = args[0];
                if (!utils.isString(selector)) {
                    throw new Error('No valid CSS selector passed: ' + selector);
                }
                casper.page.sendEvent.apply(casper.page, [type].concat(computeCenter(selector)));
                break;
            case 2:
                // coordinates
                if (!utils.isNumber(args[0]) || !utils.isNumber(args[1])) {
                    throw new Error('No valid coordinates passed');
                }
                casper.page.sendEvent(type, args[0], args[1]);
                break;
            default:
                throw new Error('Too many arguments');
        }
    };

    this.click = function() {
        processEvent('click', arguments);
    };

    this.down = function() {
        processEvent('mousedown', arguments);
    };

    this.move = function() {
        processEvent('mousemove', arguments);
    };

    this.up = function() {
        processEvent('mouseup', arguments);
    };
};
exports.Mouse = Mouse;
