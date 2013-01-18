/*!
 * kasper is a navigation utility for PhantomJS.
 *
 * Documentation: http://kasperjs.org/
 * Repository:    http://github.com/n1k0/kasperjs
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

/*global kasperError exports require*/

var utils = require('utils');

exports.create = function create(kasper) {
    "use strict";
    return new Mouse(kasper);
};

var Mouse = function Mouse(kasper) {
    "use strict";
    if (!utils.iskasperObject(kasper)) {
        throw new kasperError('Mouse() needs a kasper instance');
    }

    var slice = Array.prototype.slice,
        nativeEvents = ['mouseup', 'mousedown', 'click', 'mousemove'];
    if (utils.gteVersion(phantom.version, '1.8.0')) {
        nativeEvents.push('doubleclick');
    }
    var emulatedEvents = ['mouseover', 'mouseout'],
        supportedEvents = nativeEvents.concat(emulatedEvents);

    function computeCenter(selector) {
        var bounds = kasper.getElementBounds(selector);
        if (utils.isClipRect(bounds)) {
            var x = Math.round(bounds.left + bounds.width / 2);
            var y = Math.round(bounds.top  + bounds.height / 2);
            return [x, y];
        }
    }

    function processEvent(type, args) {
        if (!utils.isString(type) || supportedEvents.indexOf(type) === -1) {
            throw new kasperError('Mouse.processEvent(): Unsupported mouse event type: ' + type);
        }
        if (emulatedEvents.indexOf(type) > -1) {
            kasper.log("Mouse.processEvent(): no native fallback for type " + type, "warning");
        }
        args = slice.call(args); // cast Arguments -> Array
        kasper.emit('mouse.' + type.replace('mouse', ''), args);
        switch (args.length) {
            case 0:
                throw new kasperError('Mouse.processEvent(): Too few arguments');
            case 1:
                // selector
                kasper.page.sendEvent.apply(kasper.page, [type].concat(computeCenter(args[0])));
                break;
            case 2:
                // coordinates
                if (!utils.isNumber(args[0]) || !utils.isNumber(args[1])) {
                    throw new kasperError('Mouse.processEvent(): No valid coordinates passed: ' + args);
                }
                kasper.page.sendEvent(type, args[0], args[1]);
                break;
            default:
                throw new kasperError('Mouse.processEvent(): Too many arguments');
        }
    }

    this.processEvent = function() {
        processEvent(arguments[0], slice.call(arguments, 1));
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

    this.up = function up() {
        processEvent('mouseup', arguments);
    };
};
exports.Mouse = Mouse;
