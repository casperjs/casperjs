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

var colorizer = require('colorizer');
var events = require('events');
var fs = require('fs');
var mouse = require('mouse');
var qs = require('querystring');
var tester = require('tester');
var utils = require('utils');
var f = utils.format;

exports.create = function(options) {
    return new Casper(options);
};

/**
 * Main Casper object.
 *
 * @param  Object  options  Casper options
 */
var Casper = function(options) {
    var DEFAULT_DIE_MESSAGE = "Suite explicitely interrupted without any message given.";
    var DEFAULT_USER_AGENT  = "Mozilla/5.0 (Windows NT 6.0) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.112 Safari/535.1";
    // init & checks
    if (!(this instanceof arguments.callee)) {
        return new Casper(options);
    }
    // default options
    this.defaults = {
        clientScripts:       [],
        faultTolerant:       true,
        logLevel:            "error",
        httpStatusHandlers:  {},
        onAlert:             null,
        onDie:               null,
        onError:             null,
        onLoadError:         null,
        onPageInitialized:   null,
        onResourceReceived:  null,
        onResourceRequested: null,
        onStepComplete:      null,
        onStepTimeout:       null,
        onTimeout:           null,
        page:                null,
        pageSettings:        {
            localToRemoteUrlAccessEnabled: true,
            userAgent:                     DEFAULT_USER_AGENT
        },
        stepTimeout:         null,
        timeout:             null,
        verbose:             false
    };
    // properties
    this.checker = null;
    this.cli = phantom.casperArgs;
    this.colorizer = colorizer.create();
    this.currentUrl = 'about:blank';
    this.currentHTTPStatus = 200;
    this.defaultWaitTimeout = 5000;
    this.history = [];
    this.loadInProgress = false;
    this.logFormats = {};
    this.logLevels = ["debug", "info", "warning", "error"];
    this.logStyles = {
        debug:   'INFO',
        info:    'PARAMETER',
        warning: 'COMMENT',
        error:   'ERROR'
    };
    this.mouse = mouse.create(this);
    this.options = utils.mergeObjects(this.defaults, options);
    this.page = null;
    this.pendingWait = false;
    this.requestUrl = 'about:blank';
    this.resources = [];
    this.result = {
        log:    [],
        status: "success",
        time:   0
    };
    this.started = false;
    this.step = -1;
    this.steps = [];
    this.test = tester.create(this);

    // basic event handlers
    this.on('deprecated', function(message) {
        this.echo('[deprecated] ' + message, 'COMMENT');
    });
};

// Casper class is an EventEmitter
utils.inherits(Casper, events.EventEmitter);

/**
 * Go a step back in browser's history
 *
 * @return Casper
 */
Casper.prototype.back = function back() {
    return this.then(function() {
        this.emit('back');
        this.evaluate(function() {
            history.back();
        });
    });
};

/**
 * Encodes a resource using the base64 algorithm synchroneously using
 * client-side XMLHttpRequest.
 *
 * NOTE: we cannot use window.btoa() for some strange reasons here.
 *
 * @param  String  url     The url to download
 * @param  String  method  The method to use, optional: default GET
 * @param  String  data    The data to send, optional
 * @return string          Base64 encoded result
 */
Casper.prototype.base64encode = function base64encode(url, method, data) {
    return this.evaluate(function(url, method, data) {
        return __utils__.getBase64(url, method, data);
    }, { url: url, method: method, data: data });
};

/**
 * Proxy method for WebPage#render. Adds a clipRect parameter for
 * automatically set page clipRect setting values and sets it back once
 * done. If the cliprect parameter is omitted, the full page viewport
 * area will be rendered.
 *
 * @param  String  targetFile  A target filename
 * @param  mixed   clipRect    An optional clipRect object (optional)
 * @return Casper
 */
Casper.prototype.capture = function capture(targetFile, clipRect) {
    var previousClipRect;
    targetFile = fs.absolute(targetFile);
    if (clipRect) {
        if (!utils.isClipRect(clipRect)) {
            throw new CasperError("clipRect must be a valid ClipRect object.");
        }
        previousClipRect = this.page.clipRect;
        this.page.clipRect = clipRect;
        this.log(f("Capturing page to %s with clipRect %s", targetFile, JSON.stringify(clipRect)), "debug");
    } else {
        this.log(f("Capturing page to %s", targetFile), "debug");
    }
    if (!this.page.render(this.filter('capture.target_filename', targetFile) || targetFile)) {
        this.log(f("Failed to save screenshot to %s; please check permissions", targetFile), "error");
    } else {
        this.log(f("Capture saved to %s", targetFile), "info");
        this.emit('capture.saved', targetFile);
    }
    if (previousClipRect) {
        this.page.clipRect = previousClipRect;
    }
    return this;
};

/**
 * Captures the page area containing the provided selector.
 *
 * @param  String  targetFile  Target destination file path.
 * @param  String  selector    CSS3 selector
 * @return Casper
 */
Casper.prototype.captureSelector = function captureSelector(targetFile, selector) {
    return this.capture(targetFile, this.getElementBounds(selector));
};

/**
 * Checks for any further navigation step to process.
 *
 * @param  Casper    self        A self reference
 * @param  function  onComplete  An options callback to apply on completion
 */
Casper.prototype.checkStep = function checkStep(self, onComplete) {
    if (self.pendingWait || self.loadInProgress) {
        return;
    }
    var step = self.steps[self.step++];
    if (utils.isFunction(step)) {
        self.runStep(step);
    } else {
        self.result.time = new Date().getTime() - self.startTime;
        self.log(f("Done %s steps in %dms", self.steps.length, self.result.time), "info");
        clearInterval(self.checker);
        self.emit('run.complete');
        if (utils.isFunction(onComplete)) {
            try {
                onComplete.call(self, self);
            } catch (err) {
                self.log("Could not complete final step: " + err, "error");
            }
        } else {
            // default behavior is to exit
            self.exit();
        }
    }
};

/**
 * Clears the current page execution environment context. Useful to avoid
 * having previously loaded DOM contents being still active (refs #34).
 *
 * Think of it as a way to stop javascript execution within the remote DOM
 * environment.
 *
 * @return Casper
 */
Casper.prototype.clear = function clear() {
    this.page.content = '';
    return this;
};

/**
 * Emulates a click on the element from the provided selector using the mouse
 * pointer, if possible.
 *
 * In case of success, `true` is returned, `false` otherwise.
 *
 * @param  String   selector        A DOM CSS3 compatible selector
 * @return Boolean
 */
Casper.prototype.click = function click(selector) {
    this.log("Click on selector: " + selector, "debug");
    if (arguments.length > 1) {
        this.emit("deprecated", "The click() method does not process the fallbackToHref argument since 0.6");
    }
    if (!this.exists(selector)) {
        throw new CasperError("Cannot click on unexistent selector: " + selector);
    }
    var clicked = this.evaluate(function(selector) {
        return __utils__.click(selector);
    }, { selector: selector });
    if (!clicked) {
        // fallback onto native QtWebKit mouse events
        try {
            this.mouse.click(selector);
        } catch (e) {
            this.log(f("Error while trying to click on selector %s: %s", selector, e), "error");
            return false;
        }
    }
    return true;
};

/**
 * Creates a step definition.
 *
 * @param  Function  fn       The step function to call
 * @param  Object    options  Step options
 * @return Function  The final step function
 */
Casper.prototype.createStep = function createStep(fn, options) {
    if (!utils.isFunction(fn)) {
        throw new CasperError("createStep(): a step definition must be a function");
    }
    fn.options = utils.isObject(options) ? options : {};
    this.emit('step.created', fn);
    return fn;
};

/**
 * Logs the HTML code of the current page.
 *
 * @return Casper
 */
Casper.prototype.debugHTML = function debugHTML() {
    this.echo(this.evaluate(function() {
        return document.body.innerHTML;
    }));
    return this;
};

/**
 * Logs the textual contents of the current page.
 *
 * @return Casper
 */
Casper.prototype.debugPage = function debugPage() {
    this.echo(this.evaluate(function() {
        return document.body.innerText;
    }));
    return this;
};

/**
 * Exit phantom on failure, with a logged error message.
 *
 * @param  String  message  An optional error message
 * @param  Number  status   An optional exit status code (must be > 0)
 * @return Casper
 */
Casper.prototype.die = function die(message, status) {
    this.result.status = "error";
    this.result.time = new Date().getTime() - this.startTime;
    message = utils.isString(message) && message.length > 0 ? message : DEFAULT_DIE_MESSAGE;
    this.log(message, "error");
    this.emit('die', message, status);
    if (utils.isFunction(this.options.onDie)) {
        this.options.onDie.call(this, this, message, status);
    }
    return this.exit(~~status > 0 ? ~~status : 1);
};

/**
 * Downloads a resource and saves it on the filesystem.
 *
 * @param  String  url         The url of the resource to download
 * @param  String  targetPath  The destination file path
 * @return Casper
 */
Casper.prototype.download = function download(url, targetPath) {
    var cu = require('clientutils').create();
    try {
        fs.write(targetPath, cu.decode(this.base64encode(url)), 'w');
        this.emit('downloaded.file', targetPath);
        this.log(f("Downloaded and saved resource in %s", targetPath));
    } catch (e) {
        this.log(f("Error while downloading %s to %s: %s", url, targetPath, e), "error");
    }
    return this;
};

/**
 * Iterates over the values of a provided array and execute a callback
 * for @ item.
 *
 * @param  Array     array
 * @param  Function  fn     Callback: function(self, item, index)
 * @return Casper
 */
Casper.prototype.each = function each(array, fn) {
    if (!utils.isArray(array)) {
        this.log("each() only works with arrays", "error");
        return this;
    }
    (function(self) {
        array.forEach(function(item, i) {
            fn.call(self, self, item, i);
        });
    })(this);
    return this;
};

/**
 * Prints something to stdout.
 *
 * @param  String  text   A string to echo to stdout
 * @param  String  style  An optional style name
 * @param  Number  pad    An optional pad value
 * @return Casper
 */
Casper.prototype.echo = function echo(text, style, pad) {
    var message = style ? this.colorizer.colorize(text, style, pad) : text;
    console.log(this.filter('echo.message', message) || message);
    return this;
};

/**
 * Evaluates an expression in the page context, a bit like what
 * WebPage#evaluate does, but the passed function can also accept
 * parameters if a context Object is also passed:
 *
 *     casper.evaluate(function(username, password) {
 *         document.querySelector('#username').value = username;
 *         document.querySelector('#password').value = password;
 *         document.querySelector('#submit').click();
 *     }, {
 *         username: 'Bazoonga',
 *         password: 'baz00nga'
 *     })
 *
 * FIXME: waiting for a patch of PhantomJS to allow direct passing of
 * arguments to the function.
 * TODO: don't forget to keep this backward compatible.
 *
 * @param  Function  fn       The function to be evaluated within current page DOM
 * @param  Object    context  Object containing the parameters to inject into the function
 * @return mixed
 * @see    WebPage#evaluate
 */
Casper.prototype.evaluate = function evaluate(fn, context) {
    context = utils.isObject(context) ? context : {};
    var newFn = require('injector').create(fn).process(context);
    return this.page.evaluate(newFn);
};

/**
 * Evaluates an expression within the current page DOM and die() if it
 * returns false.
 *
 * @param  function  fn       The expression to evaluate
 * @param  String    message  The error message to log
 * @return Casper
 */
Casper.prototype.evaluateOrDie = function evaluateOrDie(fn, message) {
    if (!this.evaluate(fn)) {
        return this.die(message);
    }
    return this;
};

/**
 * Checks if an element matching the provided CSS3 selector exists in
 * current page DOM.
 *
 * @param  String  selector  A CSS3 selector
 * @return Boolean
 */
Casper.prototype.exists = function exists(selector) {
    return this.evaluate(function(selector) {
        return __utils__.exists(selector);
    }, { selector: selector });
};

/**
 * Exits phantom.
 *
 * @param  Number  status  Status
 * @return Casper
 */
Casper.prototype.exit = function exit(status) {
    this.emit('exit', status);
    phantom.exit(status);
    return this;
};

/**
 * Fetches innerText within the element(s) matching a given CSS3
 * selector.
 *
 * @param  String  selector  A CSS3 selector
 * @return String
 */
Casper.prototype.fetchText = function fetchText(selector) {
    return this.evaluate(function(selector) {
        return __utils__.fetchText(selector);
    }, { selector: selector });
};

/**
 * Fills a form with provided field values.
 *
 * @param  String  selector  A CSS3 selector to the target form to fill
 * @param  Object  vals      Field values
 * @param  Boolean submit    Submit the form?
 */
Casper.prototype.fill = function fill(selector, vals, submit) {
    submit = submit === true ? submit : false;
    if (!utils.isString(selector) || !selector.length) {
        throw new CasperError("Form selector must be a non-empty string");
    }
    if (!utils.isObject(vals)) {
        throw new CasperError("Form values must be provided as an object");
    }
    this.emit('fill', selector, vals, submit);
    var fillResults = this.evaluate(function(selector, values) {
       return __utils__.fill(selector, values);
    }, {
        selector: selector,
        values:   vals
    });
    if (!fillResults) {
        throw new CasperError("Unable to fill form");
    } else if (fillResults.errors.length > 0) {
        (function(self){
            fillResults.errors.forEach(function(error) {
                self.log("form error: " + error, "error");
            });
        })(this);
        if (submit) {
            this.log("Errors encountered while filling form; submission aborted", "warning");
            submit = false;
        }
    }
    // File uploads
    if (fillResults.files && fillResults.files.length > 0) {
        (function(self) {
            fillResults.files.forEach(function(file) {
                var fileFieldSelector = [selector, 'input[name="' + file.name + '"]'].join(' ');
                self.page.uploadFile(fileFieldSelector, file.path);
            });
        })(this);
    }
    // Form submission?
    if (submit) {
        this.evaluate(function(selector) {
            var form = __utils__.findOne(selector);
            var method = form.getAttribute('method').toUpperCase() || "GET";
            var action = form.getAttribute('action') || "unknown";
            __utils__.log('submitting form to ' + action + ', HTTP ' + method, 'info');
            form.submit();
        }, { selector: selector });
    }
};

/**
 * Go a step forward in browser's history
 *
 * @return Casper
 */
Casper.prototype.forward = function forward(then) {
    return this.then(function() {
        this.emit('forward');
        this.evaluate(function() {
            history.forward();
        });
    });
};

/**
 * Retrieves current document url.
 *
 * @return String
 */
Casper.prototype.getCurrentUrl = function getCurrentUrl() {
    return decodeURIComponent(this.evaluate(function() {
        return document.location.href;
    }));
};

/**
 * Retrieves boundaries for a DOM element matching the provided CSS3 selector.
 *
 * @param  String  selector  A CSS3 selector
 * @return Object
 */
Casper.prototype.getElementBounds = function getElementBounds(selector) {
    if (!this.exists(selector)) {
        throw new CasperError("No element matching selector found: " + selector);
    }
    var clipRect = this.evaluate(function(selector) {
        return __utils__.getElementBounds(selector);
    }, { selector: selector });
    if (!utils.isClipRect(clipRect)) {
        throw new CasperError('Could not fetch boundaries for element matching selector: ' + selector);
    }
    return clipRect;
};

/**
 * Retrieves global variable.
 *
 * @param  String  name  The name of the global variable to retrieve
 * @return mixed
 */
Casper.prototype.getGlobal = function getGlobal(name) {
    var result = this.evaluate(function(name) {
        var result = {};
        try {
            result.value = JSON.stringify(window[name]);
        } catch (e) {
            var message = f("Unable to JSON encode window.%s: %s", name, e);
            __utils__.log(message, "error");
            result.error = message;
        }
        return result;
    }, {'name': name});
    if ('error' in result) {
        throw new CasperError(result.error);
    } else if (utils.isString(result.value)) {
        return JSON.parse(result.value);
    } else {
        return undefined;
    }
};

/**
 * Retrieves current page title, if any.
 *
 * @return String
 */
Casper.prototype.getTitle = function getTitle() {
    return this.evaluate(function() {
        return document.title;
    });
};

/**
 * Logs a message.
 *
 * @param  String  message  The message to log
 * @param  String  level    The log message level (from Casper.logLevels property)
 * @param  String  space    Space from where the logged event occured (default: "phantom")
 * @return Casper
 */
Casper.prototype.log = function log(message, level, space) {
    level = level && this.logLevels.indexOf(level) > -1 ? level : "debug";
    space = space ? space : "phantom";
    if (level === "error" && utils.isFunction(this.options.onError)) {
        this.options.onError.call(this, this, message, space);
    }
    if (this.logLevels.indexOf(level) < this.logLevels.indexOf(this.options.logLevel)) {
        return this; // skip logging
    }
    var entry = {
        level:   level,
        space:   space,
        message: message,
        date:    new Date().toString()
    };
    if (level in this.logFormats && utils.isFunction(this.logFormats[level])) {
        message = this.logFormats[level](message, level, space);
    } else {
        var levelStr = this.colorizer.colorize(f('[%s]', level), this.logStyles[level]);
        message = f('%s [%s] %s', levelStr, space, message);
    }
    if (this.options.verbose) {
        this.echo(this.filter('log.message', message) || message); // direct output
    }
    this.result.log.push(entry);
    this.emit('log', entry);
    return this;
};

/**
 * Emulates a click on an HTML element matching a given CSS3 selector,
 * using the mouse pointer.
 *
 * @param  String   selector        A DOM CSS3 compatible selector
 * @return Casper
 * @deprecated
 * @since 0.6
 */
Casper.prototype.mouseClick = function mouseClick(selector) {
    this.emit("deprecated", "The mouseClick() method has been deprecated since 0.6; use click() instead");
    return this.click(selector);
};

/**
 * Performs an HTTP request.
 *
 * @param  String  location  The url to open
 * @param  Object  settings  The request settings
 * @return Casper
 */
Casper.prototype.open = function open(location, settings) {
    var self = this;
    // settings validation
    if (!settings) {
        settings = {
            method: "get"
        };
    }
    if (!utils.isObject(settings)) {
        throw new CasperError("open(): request settings must be an Object");
    }
    // http method
    // taken from https://github.com/ariya/phantomjs/blob/master/src/webpage.cpp#L302
    var methods = ["get", "head", "put", "post", "delete"];
    if (settings.method && (!utils.isString(settings.method) || methods.indexOf(settings.method) === -1)) {
        throw new CasperError("open(): settings.method must be part of " + methods.join(', '));
    }
    // http data
    if (settings.data) {
        if (utils.isObject(settings.data)) { // query object
            settings.data = qs.encode(settings.data);
        } else if (!utils.isString(settings.data)) {
            throw new CasperError("open(): invalid request settings data value: " + settings.data);
        }
    }
    // current request url
    this.requestUrl = this.filter('open.location', location) || location;
    // http auth
    if (settings.username && settings.password) {
        this.setHttpAuth(settings.username, settings.password);
    } else {
        var httpAuthMatch = location.match(/^https?:\/\/(.+):(.+)@/i);
        if (httpAuthMatch) {
            var httpAuth = {
                username: httpAuthMatch[1],
                password: httpAuthMatch[2]
            };
            this.setHttpAuth(httpAuth.username, httpAuth.password);
        }
    }
    this.emit('open', this.requestUrl, settings);
    this.page.openUrl(this.requestUrl, {
        operation: settings.method,
        data:      settings.data
    }, this.page.settings);
    return this;
};

/**
 * Repeats a step a given number of times.
 *
 * @param  Number    times  Number of times to repeat step
 * @aram   function  then   The step closure
 * @return Casper
 * @see    Casper#then
 */
Casper.prototype.repeat = function repeat(times, then) {
    for (var i = 0; i < times; i++) {
        this.then(then);
    }
    return this;
};

/**
 * Checks if a given resource was loaded by the remote page.
 *
 * @param  Function/String/RegExp  test  A test function, string or regular expression.
 *                                       In case a string is passed, url matching will be tested.
 * @return Boolean
 */
Casper.prototype.resourceExists = function resourceExists(test) {
    var testFn;
    switch (utils.betterTypeOf(test)) {
        case "string":
            testFn = function(res) {
                return res.url.search(test) !== -1;
            };
            break;
        case "regexp":
            testFn = function(res) {
                return test.test(res.url);
            };
            break;
        case "function":
            testFn = test;
            break;
        default:
            throw new CasperError("Invalid type");
    }
    return this.resources.some(testFn);
};

/**
 * Runs the whole suite of steps.
 *
 * @param  function  onComplete  an optional callback
 * @param  Number    time        an optional amount of milliseconds for interval checking
 * @return Casper
 */
Casper.prototype.run = function run(onComplete, time) {
    if (!this.steps || this.steps.length < 1) {
        this.log("No steps defined, aborting", "error");
        return this;
    }
    this.log(f("Running suite: %d step%s", this.steps.length, this.steps.length > 1 ? "s" : ""), "info");
    this.emit('run.start');
    this.checker = setInterval(this.checkStep, (time ? time: 100), this, onComplete);
    return this;
};

/**
 * Runs a step.
 *
 * @param  Function  step
 */
Casper.prototype.runStep = function runStep(step) {
    var skipLog = utils.isObject(step.options) && step.options.skipLog === true;
    var stepInfo = f("Step %d/%d", this.step, this.steps.length);
    var stepResult;
    if (!skipLog) {
        this.log(stepInfo + f(' %s (HTTP %d)', this.getCurrentUrl(), this.currentHTTPStatus), "info");
    }
    if (utils.isNumber(this.options.stepTimeout) && this.options.stepTimeout > 0) {
        var stepTimeoutCheckInterval = setInterval(function(self, start, stepNum) {
            if (new Date().getTime() - start > self.options.stepTimeout) {
                if (self.step == stepNum) {
                    self.emit('step.timeout');
                    if (utils.isFunction(self.options.onStepTimeout)) {
                        self.options.onStepTimeout.call(self, self);
                    } else {
                        self.die("Maximum step execution timeout exceeded for step " + stepNum, "error");
                    }
                }
                clearInterval(stepTimeoutCheckInterval);
            }
        }, this.options.stepTimeout, this, new Date().getTime(), this.step);
    }
    this.emit('step.start', step);
    try {
        stepResult = step.call(this, this);
    } catch (e) {
        this.emit('step.error', e);
        if (this.options.faultTolerant) {
            this.log("Step error: " + e, "error");
        } else {
            throw e;
        }
    }
    if (utils.isFunction(this.options.onStepComplete)) {
        this.options.onStepComplete.call(this, this, stepResult);
    }
    if (!skipLog) {
        this.emit('step.complete', stepResult);
        this.log(stepInfo + f(": done in %dms.", new Date().getTime() - this.startTime), "info");
    }
};

/**
 * Sets HTTP authentication parameters.
 *
 * @param  String   username  The HTTP_AUTH_USER value
 * @param  String   password  The HTTP_AUTH_PW value
 * @return Casper
 */
Casper.prototype.setHttpAuth = function setHttpAuth(username, password) {
    if (!this.started) {
        throw new CasperError("Casper must be started in order to use the setHttpAuth() method");
    }
    if (!utils.isString(username) || !utils.isString(password)) {
        throw new CasperError("Both username and password must be strings");
    }
    this.page.settings.userName = username;
    this.page.settings.password = password;
    this.emit('http.auth', username, password);
    this.log("Setting HTTP authentication for user " + username, "info");
    return this;
};

/**
 * Configures and starts Casper.
 *
 * @param  String   location  An optional location to open on start
 * @param  function then      Next step function to execute on page loaded (optional)
 * @return Casper
 */
Casper.prototype.start = function start(location, then) {
    this.emit('starting');
    this.log('Starting...', "info");
    this.startTime = new Date().getTime();
    this.history = [];
    this.steps = [];
    this.step = 0;
    // Option checks
    if (this.logLevels.indexOf(this.options.logLevel) < 0) {
        this.log(f("Unknown log level '%d', defaulting to 'warning'", this.options.logLevel), "warning");
        this.options.logLevel = "warning";
    }
    // WebPage
    if (!utils.isWebPage(this.page)) {
        if (utils.isWebPage(this.options.page)) {
            this.page = this.options.page;
        } else {
            this.page = createPage(this);
        }
    }
    this.page.settings = utils.mergeObjects(this.page.settings, this.options.pageSettings);
    if (utils.isClipRect(this.options.clipRect)) {
        this.page.clipRect = this.options.clipRect;
    }
    if (utils.isObject(this.options.viewportSize)) {
        this.page.viewportSize = this.options.viewportSize;
    }
    this.started = true;
    this.emit('started');
    if (utils.isNumber(this.options.timeout) && this.options.timeout > 0) {
        this.log(f("Execution timeout set to %dms", this.options.timeout), "info");
        setTimeout(function(self) {
            self.emit('timeout');
            if (utils.isFunction(self.options.onTimeout)) {
                self.options.onTimeout.call(self, self);
            } else {
                self.die(f("Timeout of %dms exceeded, exiting.", self.options.timeout));
            }
        }, this.options.timeout, this);
    }
    this.emit('page.initialized', this);
    if (utils.isFunction(this.options.onPageInitialized)) {
        this.log("Post-configuring WebPage instance", "debug");
        this.options.onPageInitialized.call(this, this.page);
    }
    if (utils.isString(location) && location.length > 0) {
        return this.thenOpen(location, utils.isFunction(then) ? then : this.createStep(function(self) {
            self.log("start page is loaded", "debug");
        }));
    }
    return this;
};

/**
 * Schedules the next step in the navigation process.
 *
 * @param  function  step  A function to be called as a step
 * @return Casper
 */
Casper.prototype.then = function then(step) {
    if (!this.started) {
        throw new CasperError("Casper not started; please use Casper#start");
    }
    if (!utils.isFunction(step)) {
        throw new CasperError("You can only define a step as a function");
    }
    // check if casper is running
    if (this.checker === null) {
        // append step to the end of the queue
        step.level = 0;
        this.steps.push(step);
    } else {
        // insert substep a level deeper
        try {
            step.level = this.steps[this.step - 1].level + 1;
        } catch (e) {
            step.level = 0;
        }
        var insertIndex = this.step;
        while (this.steps[insertIndex] && step.level === this.steps[insertIndex].level) {
            insertIndex++;
        }
        this.steps.splice(insertIndex, 0, step);
    }
    this.emit('step.added', step);
    return this;
};

/**
 * Adds a new navigation step for clicking on a provided link selector
 * and execute an optional next step.
 *
 * @param  String   selector        A DOM CSS3 compatible selector
 * @param  Function then            Next step function to execute on page loaded (optional)
 * @return Casper
 * @see    Casper#click
 * @see    Casper#then
 */
Casper.prototype.thenClick = function thenClick(selector, then, fallbackToHref) {
    if (arguments.length > 2) {
        this.emit("deprecated", "The thenClick() method does not process the fallbackToHref argument since 0.6");
    }
    this.then(function() {
        this.click(selector);
    });
    return utils.isFunction(then) ? this.then(then) : this;
};

/**
 * Adds a new navigation step to perform code evaluation within the
 * current retrieved page DOM.
 *
 * @param  function  fn       The function to be evaluated within current page DOM
 * @param  object    context  Optional function parameters context
 * @return Casper
 * @see    Casper#evaluate
 */
Casper.prototype.thenEvaluate = function thenEvaluate(fn, context) {
    return this.then(function() {
        this.evaluate(fn, context);
    });
};

/**
 * Adds a new navigation step for opening the provided location.
 *
 * @param  String   location  The URL to load
 * @param  function then      Next step function to execute on page loaded (optional)
 * @return Casper
 * @see    Casper#open
 */
Casper.prototype.thenOpen = function thenOpen(location, then) {
    this.then(this.createStep(function() {
        this.open(location);
    }, {
        skipLog: true
    }));
    return utils.isFunction(then) ? this.then(then) : this;
};

/**
 * Adds a new navigation step for opening and evaluate an expression
 * against the DOM retrieved from the provided location.
 *
 * @param  String    location  The url to open
 * @param  function  fn        The function to be evaluated within current page DOM
 * @param  object    context   Optional function parameters context
 * @return Casper
 * @see    Casper#evaluate
 * @see    Casper#open
 */
Casper.prototype.thenOpenAndEvaluate = function thenOpenAndEvaluate(location, fn, context) {
    return this.thenOpen(location).thenEvaluate(fn, context);
};

/**
 * Changes the current viewport size.
 *
 * @param  Number  width   The viewport width, in pixels
 * @param  Number  height  The viewport height, in pixels
 * @return Casper
 */
Casper.prototype.viewport = function viewport(width, height) {
    if (!this.started) {
        throw new CasperError("Casper must be started in order to set viewport at runtime");
    }
    if (!utils.isNumber(width) || !utils.isNumber(height) || width <= 0 || height <= 0) {
        throw new CasperError(f("Invalid viewport: %dx%d", width, height));
    }
    this.page.viewportSize = {
        width: width,
        height: height
    };
    this.emit('viewport.changed', [width, height]);
    return this;
};

/**
 * Checks if an element matching the provided CSS3 selector is visible
 * current page DOM by checking that offsetWidth and offsetHeight are
 * both non-zero.
 *
 * @param  String  selector  A CSS3 selector
 * @return Boolean
 */
Casper.prototype.visible = function visible(selector) {
    return this.evaluate(function(selector) {
        return __utils__.visible(selector);
    }, { selector: selector });
};

/**
 * Adds a new step that will wait for a given amount of time (expressed
 * in milliseconds) before processing an optional next one.
 *
 * @param  Number    timeout  The max amount of time to wait, in milliseconds
 * @param  Function  then     Next step to process (optional)
 * @return Casper
 */
Casper.prototype.wait = function wait(timeout, then) {
    timeout = ~~timeout;
    if (timeout < 1) {
        this.die("wait() only accepts a positive integer > 0 as a timeout value");
    }
    if (then && !utils.isFunction(then)) {
        this.die("wait() a step definition must be a function");
    }
    return this.then(function() {
        this.waitStart();
        setTimeout(function(self) {
          self.log(f("wait() finished wating for %dms.", timeout), "info");
          if (then) {
            then.call(self, self);
          }
          self.waitDone();
        }, timeout, this);
    });
};

Casper.prototype.waitStart = function waitStart() {
    this.emit('wait.start');
    this.pendingWait = true;
};

Casper.prototype.waitDone = function waitDone() {
    this.emit('wait.done');
    this.pendingWait = false;
};

/**
 * Waits until a function returns true to process a next step.
 *
 * @param  Function  testFx     A function to be evaluated for returning condition satisfecit
 * @param  Function  then       The next step to perform (optional)
 * @param  Function  onTimeout  A callback function to call on timeout (optional)
 * @param  Number    timeout    The max amount of time to wait, in milliseconds (optional)
 * @return Casper
 */
Casper.prototype.waitFor = function waitFor(testFx, then, onTimeout, timeout) {
    timeout = timeout ? timeout : this.defaultWaitTimeout;
    if (!utils.isFunction(testFx)) {
        this.die("waitFor() needs a test function");
    }
    if (then && !utils.isFunction(then)) {
        this.die("waitFor() next step definition must be a function");
    }
    return this.then(function() {
        this.waitStart();
        var start = new Date().getTime();
        var condition = false;
        var interval = setInterval(function(self, testFx, timeout, onTimeout) {
            if ((new Date().getTime() - start < timeout) && !condition) {
                condition = testFx.call(self, self);
            } else {
                self.waitDone();
                if (!condition) {
                    self.log("Casper.waitFor() timeout", "warning");
                    self.emit('waitFor.timeout');
                    if (utils.isFunction(onTimeout)) {
                        onTimeout.call(self, self);
                    } else {
                        self.die(f("Timeout of %dms expired, exiting.", timeout), "error");
                    }
                } else {
                    self.log(f("waitFor() finished in %dms.", new Date().getTime() - start), "info");
                    if (then) {
                        self.then(then);
                    }
                }
                clearInterval(interval);
            }
        }, 100, this, testFx, timeout, onTimeout);
    });
};

/**
 * Waits until a given resource is loaded
 *
 * @param  String/Function  test       A function to test if the resource exists.
 *                                     A string will be matched against the resources url.
 * @param  Function         then       The next step to perform (optional)
 * @param  Function         onTimeout  A callback function to call on timeout (optional)
 * @param  Number           timeout    The max amount of time to wait, in milliseconds (optional)
 * @return Casper
 */
Casper.prototype.waitForResource = function waitForResource(test, then, onTimeout, timeout) {
    timeout = timeout ? timeout : this.defaultWaitTimeout;
    return this.waitFor(function(self) {
        return self.resourceExists(test);
    }, then, onTimeout, timeout);
};

/**
 * Waits until an element matching the provided CSS3 selector exists in
 * remote DOM to process a next step.
 *
 * @param  String    selector   A CSS3 selector
 * @param  Function  then       The next step to perform (optional)
 * @param  Function  onTimeout  A callback function to call on timeout (optional)
 * @param  Number    timeout    The max amount of time to wait, in milliseconds (optional)
 * @return Casper
 */
Casper.prototype.waitForSelector = function waitForSelector(selector, then, onTimeout, timeout) {
    timeout = timeout ? timeout : this.defaultWaitTimeout;
    return this.waitFor(function(self) {
        return self.exists(selector);
    }, then, onTimeout, timeout);
};

/**
 * Waits until an element matching the provided CSS3 selector does not
 * exist in the remote DOM to process a next step.
 *
 * @param  String    selector   A CSS3 selector
 * @param  Function  then       The next step to perform (optional)
 * @param  Function  onTimeout  A callback function to call on timeout (optional)
 * @param  Number    timeout    The max amount of time to wait, in milliseconds (optional)
 * @return Casper
 */
Casper.prototype.waitWhileSelector = function waitWhileSelector(selector, then, onTimeout, timeout) {
    timeout = timeout ? timeout : this.defaultWaitTimeout;
    return this.waitFor(function(self) {
        return !self.exists(selector);
    }, then, onTimeout, timeout);
};

/**
 * Waits until an element matching the provided CSS3 selector is
 * visible in the remote DOM to process a next step.
 *
 * @param  String    selector   A CSS3 selector
 * @param  Function  then       The next step to perform (optional)
 * @param  Function  onTimeout  A callback function to call on timeout (optional)
 * @param  Number    timeout    The max amount of time to wait, in milliseconds (optional)
 * @return Casper
 */
Casper.prototype.waitUntilVisible = function waitUntilVisible(selector, then, onTimeout, timeout) {
    timeout = timeout ? timeout : this.defaultWaitTimeout;
    return this.waitFor(function(self) {
        return self.visible(selector);
    }, then, onTimeout, timeout);
};

/**
 * Waits until an element matching the provided CSS3 selector is no
 * longer visible in remote DOM to process a next step.
 *
 * @param  String    selector   A CSS3 selector
 * @param  Function  then       The next step to perform (optional)
 * @param  Function  onTimeout  A callback function to call on timeout (optional)
 * @param  Number    timeout    The max amount of time to wait, in milliseconds (optional)
 * @return Casper
 */
Casper.prototype.waitWhileVisible = function waitWhileVisible(selector, then, onTimeout, timeout) {
    timeout = timeout ? timeout : this.defaultWaitTimeout;
    return this.waitFor(function(self) {
        return !self.visible(selector);
    }, then, onTimeout, timeout);
};

/**
 * Extends Casper's prototype with provided one.
 *
 * @param  Object  proto  Prototype methods to add to Casper
 * @deprecated
 * @since 0.6
 */
Casper.extend = function(proto) {
    console.warn('Casper.extend() has been deprecated since 0.6; check the docs');
    if (!utils.isObject(proto)) {
        throw new CasperError("extends() only accept objects as prototypes");
    }
    utils.mergeObjects(Casper.prototype, proto);
};

exports.Casper = Casper;

/**
 * Creates a new WebPage instance for Casper use.
 *
 * @param  Casper  casper  A Casper instance
 * @return WebPage
 */
function createPage(casper) {
    var page;
    if (phantom.version.major <= 1 && phantom.version.minor < 3 && utils.isFunction(require)) {
        page = new WebPage();
    } else {
        page = require('webpage').create();
    }
    page.onAlert = function(message) {
        casper.log('[alert] ' + message, "info", "remote");
        casper.emit('remote.alert', message);
        if (utils.isFunction(casper.options.onAlert)) {
            casper.options.onAlert.call(casper, casper, message);
        }
    };
    page.onConsoleMessage = function(msg) {
        var level = "info", test = /^\[casper:(\w+)\]\s?(.*)/.exec(msg);
        if (test && test.length === 3) {
            level = test[1];
            msg = test[2];
        }
        casper.log(msg, level, "remote");
        casper.emit('remote.message', msg);
    };
    page.onLoadStarted = function() {
        casper.loadInProgress = true;
        casper.resources = [];
        casper.emit('load.started');
    };
    page.onLoadFinished = function(status) {
        if (status !== "success") {
            casper.emit('load.failed', {
                status:      status,
                http_status: casper.currentHTTPStatus,
                url:         casper.requestUrl
            });
            var message = 'Loading resource failed with status=' + status;
            if (casper.currentHTTPStatus) {
                message += f(' (HTTP %d)', casper.currentHTTPStatus);
            }
            message += ': ' + casper.requestUrl;
            casper.log(message, "warning");
            if (utils.isFunction(casper.options.onLoadError)) {
                casper.options.onLoadError.call(casper, casper, casper.requestUrl, status);
            }
        }
        if (casper.options.clientScripts) {
            if (!utils.isArray(casper.options.clientScripts)) {
                throw new CasperError("The clientScripts option must be an array");
            } else {
                casper.options.clientScripts.forEach(function(script) {
                    if (casper.page.injectJs(script)) {
                        casper.log(f('Automatically injected %s client side', script), "debug");
                    } else {
                        casper.log(f('Failed injecting %s client side', script), "warning");
                    }
                });
            }
        }
        // Client-side utils injection
        var clientUtilsPath = fs.pathJoin(phantom.casperPath, 'modules', 'clientutils.js');
        if (true === page.injectJs(clientUtilsPath)) {
            casper.log("Successfully injected Casper client-side utilities", "debug");
        } else {
            casper.log("Failed to instantiate Casper client-side utilities!", "warning");
        }
        // history
        casper.history.push(casper.getCurrentUrl());
        casper.emit('load.finished', status);
        casper.loadInProgress = false;
    };
    page.onResourceReceived = function(resource) {
        casper.emit('resource.received', resource);
        if (utils.isFunction(casper.options.onResourceReceived)) {
            casper.options.onResourceReceived.call(casper, casper, resource);
        }
        if (resource.stage === "end") {
            casper.resources.push(resource);
        }
        if (resource.url === casper.requestUrl && resource.stage === "start") {
            casper.currentHTTPStatus = resource.status;
            casper.emit('http.status.' + resource.status, resource);
            if (utils.isObject(casper.options.httpStatusHandlers) &&
                resource.status in casper.options.httpStatusHandlers &&
                utils.isFunction(casper.options.httpStatusHandlers[resource.status])) {
                casper.options.httpStatusHandlers[resource.status].call(casper, casper, resource);
            }
            casper.currentUrl = resource.url;
            casper.emit('location.changed', resource.url);
        }
    };
    page.onResourceRequested = function(request) {
        casper.emit('resource.requested', request);
        if (utils.isFunction(casper.options.onResourceRequested)) {
            casper.options.onResourceRequested.call(casper, casper, request);
        }
    };
    casper.emit('page.created', page);
    return page;
}
