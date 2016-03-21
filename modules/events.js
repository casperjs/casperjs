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

/*global CasperError*/

var isArray = Array.isArray;

var EventEmitter = function EventEmitter() {
    "use strict";
    this._filters = {};
};

exports.EventEmitter = EventEmitter;
var defaultMaxListeners = 10;

/**
 * By default EventEmitters will print a warning if more than 10 listeners
 * are added for a particular event. This is a useful default that helps finding memory leaks.
 * Obviously, not all events should be limited to just 10 listeners.
 * The emitter.setMaxListeners() method allows the limit to be modified for
 * this specific EventEmitter instance. The value can be set to Infinity (or 0)
 * to indicate an unlimited number of listeners.
 *
 * @param  Integer  nb  Max Number of Listeners
 */
EventEmitter.prototype.setMaxListeners = function(nb) {
    "use strict";
    if (!this._events) {
        this._events = {};
    }
    this._maxListeners = nb;
};

/**
 * Synchronously calls each of the listeners registered for event,
 * in the order they were registered, passing the supplied arguments to each.
 * Returns true if event had listeners, false otherwise
 *
 * @param  Array     args...  The rest of arguments passed to fn
 * @return Boolean
 * @throws {Error}            If invokation failed.
 */
EventEmitter.prototype.emit = function emit() {
    "use strict";
    var type = arguments[0];
    // If there is no 'error' event listener then throw.
    if (type === 'error') {
        if (!this._events || !this._events.error ||
        isArray(this._events.error) && !this._events.error.length) {
            if (arguments[1] instanceof Error) {
                throw arguments[1]; // Unhandled 'error' event
            } else {
                throw new CasperError("Uncaught, unspecified 'error' event.");
            }
        }
    }

    if (!this._events) {
        return false;
    }
    var handler = this._events[type];
    if (!handler) {
        return false;
    }

    if (typeof handler === 'function') {
        try {
            switch (arguments.length) {
            // fast cases
            case 1:
                handler.call(this);
                break;
            case 2:
                handler.call(this, arguments[1]);
                break;
            case 3:
                handler.call(this, arguments[1], arguments[2]);
                break;
            // slower
            default:
                var l = arguments.length;
                var args = new Array(l - 1);
                for (var i = 1; i < l; i++) {
                    args[i - 1] = arguments[i];
                }
                handler.apply(this, args);
            }
        } catch (err) {
            this.emit('event.error', err);
        }
        return true;

    } else if (isArray(handler)) {
        var l = arguments.length;
        var args = new Array(l - 1);
        for (var i = 1; i < l; i++) {
            args[i - 1] = arguments[i];
        }

        var listeners = handler.slice();
        for (var i = 0, l = listeners.length; i < l; i++) {
            listeners[i].apply(this, args);
        }
        return true;

    } else {
        return false;
    }
};

/**
 * Adds the listener function to the end of the listeners array for the specified event.
 * No checks are made to see if the listener has already been added.
 * Multiple calls passing the same combination of event and listener
 * will result in the listener being added, and called, multiple times.
 * EventEmitter is defined in src/node_events.cc
 * EventEmitter.prototype.emit() is also defined there.
 *
 * @param  String    type      An event name.
 * @param  function  filterFn  An options callback to apply on event.
 * @return EventEmitter        A reference to the EventEmitter so calls can be chained
 * @throws {CasperError}       If invokation failed.
 */
EventEmitter.prototype.addListener = function addListener(type, listener) {
    "use strict";
    if (typeof listener !== 'function') {
        throw new CasperError('addListener only takes instances of Function');
    }

    if (!this._events) {
        this._events = {};
    }

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if (!this._events[type]) {
        // Optimize the case of one listener. Don't need the extra array object.
        this._events[type] = listener;
    } else if (isArray(this._events[type])) {
        // If we've already got an array, just append.
        this._events[type][ type === 'fail' ? 'unshift' : 'push'](listener);

        // Check for listener leak
        if (!this._events[type].warned) {
            var m;
            if (typeof this._maxListeners !== 'undefined') {
                m = this._maxListeners;
            } else {
                m = defaultMaxListeners;
            }

            if (m && m > 0 && this._events[type].length > m) {
                this._events[type].warned = true;
                console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            this._events[type].length);
                console.trace();
            }
        }
    } else {
        // Adding the second element, need to change to array.
        this._events[type] = type === 'fail' ? [listener, this._events[type]] : [this._events[type], listener];
    }
    return this;
};

/**
 * Alias for emitter.addListener(type, listener).
 *
 * @param  String    type      An event name.
 * @param  function  filterFn  An options callback to apply on event.
 * @return EventEmitter        A reference to the EventEmitter so calls can be chained
 * @throws {CasperError}       If invokation failed.
 */
EventEmitter.prototype.prependListener = function prependListener(type, listener) {
    "use strict";
    if (typeof listener !== 'function') {
        throw new CasperError('addListener only takes instances of Function');
    }

    if (!this._events) {
        this._events = {};
    }

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if (!this._events[type]) {
        // Optimize the case of one listener. Don't need the extra array object.
        this._events[type] = listener;
    } else if (isArray(this._events[type])) {

        // If we've already got an array, just append.
        this._events[type].unshift(listener);

        // Check for listener leak
        if (!this._events[type].warned) {
            var m;
            if (typeof this._maxListeners !== 'undefined') {
                m = this._maxListeners;
            } else {
                m = defaultMaxListeners;
            }

            if (m && m > 0 && this._events[type].length > m) {
                this._events[type].warned = true;
                console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            this._events[type].length);
                console.trace();
            }
        }
    } else {
        // Adding the second element, need to change to array.
        this._events[type] = [listener, this._events[type]];
    }
    return this;
};

/**
 * Alias for emitter.addListener(type, listener).
 *
 * @param  String    type      An event name.
 * @param  function  filterFn  An options callback to apply on event.
 * @return EventEmitter        A reference to the EventEmitter so calls can be chained
 */
EventEmitter.prototype.on = EventEmitter.prototype.addListener;

/**
 * Adds a one time listener function for the event.
 * This listener is invoked only the next time event is triggered, after which it is removed.
 *
 * @param  String    type      An event name.
 * @param  function  filterFn  An options callback to apply on event.
 * @return EventEmitter        A reference to the EventEmitter so calls can be chained
 * @throws {CasperError}       If invokation failed.
 */
EventEmitter.prototype.once = function once(type, listener) {
    "use strict";
    if (typeof listener !== 'function') {
        throw new CasperError('.once only takes instances of Function');
    }

    var self = this;
    var g = function g() {
        self.removeListener(type, g);
        listener.apply(this, arguments);
    };

    g.listener = listener;
    self.on(type, g);

    return this;
};

/**
 * Removes the specified listener from the listener array for the specified event.
 *
 * @param  String    type      An event name
 * @param  function  filterFn  An options callback to apply on event
 * @return EventEmitter        A reference to the EventEmitter so calls can be chained
 * @throws {CasperError}      If invokation failed.
 */
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
    "use strict";
    if (typeof listener !== 'function') {
        throw new CasperError('removeListener only takes instances of Function');
    }

    // does not use listeners(), so no side effect of creating _events[type]
    if (!this._events || !this._events[type]) {
        return this;
    }

    var list = this._events[type];

    if (isArray(list)) {
        var position = -1;
        for (var i = 0, length = list.length; i < length; i++) {
            if (list[i] === listener ||
                list[i].listener && list[i].listener === listener) {
                position = i;
                break;
            }
        }
        if (position < 0) {
            return this;
        }
        list.splice(position, 1);
        if (list.length === 0) {
            delete this._events[type];
        }
    } else if (list === listener ||
             list.listener && list.listener === listener) {
        delete this._events[type];
    }

    return this;
};

/**
 * Removes all listeners, or those of the specified event.
 *
 * @param  String    type      An event name
 * @return EventEmitter        A reference to the EventEmitter so calls can be chained
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
    "use strict";
    if (arguments.length === 0) {
        this._events = {};
        return this;
    }

    // does not use listeners(), so no side effect of creating _events[type]
    if (type && this._events && this._events[type]) {
        this._events[type] = null;
    }
    return this;
};

/**
 * get callbacks listener.
 *
 * @param  String    type      An event name
 * @return mixed
 */
EventEmitter.prototype.listeners = function listeners(type) {
    "use strict";
    if (!this._events) {
        this._events = {};
    }
    if (!this._events[type]) {
        this._events[type] = [];
    }
    if (!isArray(this._events[type])) {
        this._events[type] = [this._events[type]];
    }
    return this._events[type];
};

/**
 * Trigger filter attached to an event and return value(s).
 *
 * @param  String    type      An event name
 * @param  Array     args...  The rest of arguments passed to fn
 * @return mixed
 */
EventEmitter.prototype.filter = function filter() {
    "use strict";
    var type = arguments[0], res;
    if (!this._filters) {
        this._filters = {};
    }
    var _filter = this._filters[type];
    if (typeof _filter === 'function') {
        res = _filter.apply(this, Array.prototype.slice.call(arguments, 1));
    }
    this.emit(Array.prototype.slice.call(arguments, 0).concat([res]));
    return res;
};

/**
 * Remove all filters attached to events or only filters attached to a specific event.
 *
 * @param  String    type      An event name
 * @return EventEmitter        A reference to the EventEmitter so calls can be chained
 */
EventEmitter.prototype.removeAllFilters = function removeAllFilters(type) {
    "use strict";
    if (arguments.length === 0) {
        this._filters = {};
        return this;
    }
    if (type && this._filters && this._filters[type]) {
        this._filters[type] = null;
    }
    return this;
};

/**
 * attaches a filter to an event.
 *
 * @param  String    type      An event name
 * @param  function  filterFn  An options callback to apply on event
 * @return Boolean
 * @throws {CasperError}       If invokation failed
 */
EventEmitter.prototype.setFilter = function setFilter(type, filterFn) {
    "use strict";
    if (!this._filters) {
        this._filters = {};
    }
    if (typeof filterFn !== 'function') {
        throw new CasperError('setFilter only takes instances of Function');
    }
    if (!this._filters[type]) {
        this._filters[type] = filterFn;
        return true;
    }
    // TODO: process multiple filters? in which order? disallow?
    return false;
};
