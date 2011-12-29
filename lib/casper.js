/*!
 * Casper is a navigation utility for PhantomJS.
 *
 * Documentation: http://n1k0.github.com/casperjs/
 * Repository:    http://github.com/n1k0/casperjs
 *
 * Copyright (c) 2011 Nicolas Perriault
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
(function(phantom) {
    /**
     * Main Casper object.
     *
     * @param  Object  options  Casper options
     * @return Casper
     */
    phantom.Casper = function(options) {
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
        this.colorizer = new phantom.Casper.Colorizer();
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
        this.options = mergeObjects(this.defaults, options);
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
        this.test = new phantom.Casper.Tester(this);
    };

    /**
     * Casper prototype
     */
    phantom.Casper.prototype = {
        /**
         * Go a step back in browser's history
         *
         * @return Casper
         */
        back: function() {
            return this.then(function(self) {
                self.evaluate(function() {
                    history.back();
                });
            });
        },

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
        base64encode: function(url, method, data) {
            return this.evaluate(function(url, method, data) {
                return __utils__.getBase64(url, method, data);
            }, { url: url, method: method, data: data });
        },

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
        capture: function(targetFile, clipRect) {
            var previousClipRect;
            targetFile = require('fs').absolute(targetFile);
            if (clipRect) {
                if (!isType(clipRect, "object")) {
                    throw new Error("clipRect must be an Object instance.");
                }
                previousClipRect = this.page.clipRect;
                this.page.clipRect = clipRect;
                this.log('Capturing page to ' + targetFile + ' with clipRect' + JSON.stringify(clipRect), "debug");
            } else {
                this.log('Capturing page to ' + targetFile, "debug");
            }
            if (!this.page.render(targetFile)) {
                this.log('Failed to save screenshot to ' + targetFile + '; please check permissions', "error");
            }
            if (previousClipRect) {
                this.page.clipRect = previousClipRect;
            }
            return this;
        },

        /**
         * Captures the page area containing the provided selector.
         *
         * @param  String  targetFile  Target destination file path.
         * @param  String  selector    CSS3 selector
         * @return Casper
         */
        captureSelector: function(targetFile, selector) {
            return this.capture(targetFile, this.evaluate(function(selector) {
                try {
                    var clipRect = document.querySelector(selector).getBoundingClientRect();
                    return {
                        top:    clipRect.top,
                        left:   clipRect.left,
                        width:  clipRect.width,
                        height: clipRect.height
                    };
                } catch (e) {
                    __utils__.log("Unable to fetch bounds for element " + selector, "warning");
                }
            }, { selector: selector }));
        },

        /**
         * Checks for any further navigation step to process.
         *
         * @param  Casper    self        A self reference
         * @param  function  onComplete  An options callback to apply on completion
         */
        checkStep: function(self, onComplete) {
            if (self.pendingWait || self.loadInProgress) {
                return;
            }
            var step = self.steps[self.step++];
            if (isType(step, "function")) {
                self.runStep(step);
            } else {
                self.result.time = new Date().getTime() - self.startTime;
                self.log("Done " + self.steps.length + " steps in " + self.result.time + 'ms.', "info");
                self.page.content = ''; // avoid having previously loaded DOM contents being still active (refs #34)
                clearInterval(self.checker);
                if (isType(onComplete, "function")) {
                    try {
                        onComplete.call(self, self);
                    } catch (err) {
                        self.log("Could not complete final step: " + err, "error");
                    }
                } else {
                    // default behavior is to exit phantom
                    self.exit();
                }
            }
        },

        /**
         * Emulates a click on the element from the provided selector, if
         * possible. In case of success, `true` is returned.
         *
         * @param  String   selector        A DOM CSS3 compatible selector
         * @param  Boolean  fallbackToHref  Whether to try to relocate to the value of any href attribute (default: true)
         * @return Boolean
         */
        click: function(selector, fallbackToHref) {
            fallbackToHref = isType(fallbackToHref, "undefined") ? true : !!fallbackToHref;
            this.log("Click on selector: " + selector, "debug");
            return this.evaluate(function(selector, fallbackToHref) {
                return __utils__.click(selector, fallbackToHref);
            }, {
                selector:       selector,
                fallbackToHref: fallbackToHref
            });
        },

        /**
         * Creates a step definition.
         *
         * @param  Function  fn       The step function to call
         * @param  Object    options  Step options
         * @return Function  The final step function
         */
        createStep: function(fn, options) {
            if (!isType(fn, "function")) {
                throw new Error("createStep(): a step definition must be a function");
            }
            fn.options = isType(options, "object") ? options : {};
            return fn;
        },

        /**
         * Logs the HTML code of the current page.
         *
         * @return Casper
         */
        debugHTML: function() {
            this.echo(this.evaluate(function() {
                return document.body.innerHTML;
            }));
            return this;
        },

        /**
         * Logs the textual contents of the current page.
         *
         * @return Casper
         */
        debugPage: function() {
            this.echo(this.evaluate(function() {
                return document.body.innerText;
            }));
            return this;
        },

        /**
         * Exit phantom on failure, with a logged error message.
         *
         * @param  String  message  An optional error message
         * @param  Number  status   An optional exit status code (must be > 0)
         * @return Casper
         */
        die: function(message, status) {
            this.result.status = 'error';
            this.result.time = new Date().getTime() - this.startTime;
            message = isType(message, "string") && message.length > 0 ? message : DEFAULT_DIE_MESSAGE;
            this.log(message, "error");
            if (isType(this.options.onDie, "function")) {
                this.options.onDie.call(this, this, message, status);
            }
            return this.exit(Number(status) > 0 ? Number(status) : 1);
        },

        /**
         * Downloads a resource and saves it on the filesystem.
         *
         * @param  String  url         The url of the resource to download
         * @param  String  targetPath  The destination file path
         * @return Casper
         */
        download: function(url, targetPath) {
            var cu = new phantom.Casper.ClientUtils();
            try {
                require('fs').write(targetPath, cu.decode(this.base64encode(url)), 'w');
            } catch (e) {
                this.log("Error while downloading " + url + " to " + targetPath + ": " + e, "error");
            }
            return this;
        },

        /**
         * Iterates over the values of a provided array and execute a callback
         * for each item.
         *
         * @param  Array     array
         * @param  Function  fn     Callback: function(self, item, index)
         * @return Casper
         */
        each: function(array, fn) {
            if (!isType(array, "array")) {
                this.log("each() only works with arrays", "error");
                return this;
            }
            (function(self) {
                array.forEach(function(item, i) {
                    fn(self, item, i);
                });
            })(this);
            return this;
        },

        /**
         * Prints something to stdout.
         *
         * @param  String  text  A string to echo to stdout
         * @return Casper
         */
        echo: function(text, style) {
            console.log(style ? this.colorizer.colorize(text, style) : text);
            return this;
        },

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
        evaluate: function(fn, context) {
            context = isType(context, "object") ? context : {};
            var newFn = new phantom.Casper.FunctionArgsInjector(fn).process(context);
            return this.page.evaluate(newFn);
        },

        /**
         * Evaluates an expression within the current page DOM and die() if it
         * returns false.
         *
         * @param  function  fn       The expression to evaluate
         * @param  String    message  The error message to log
         * @return Casper
         */
        evaluateOrDie: function(fn, message) {
            if (!this.evaluate(fn)) {
                return this.die(message);
            }
            return this;
        },

        /**
         * Checks if an element matching the provided CSS3 selector exists in
         * current page DOM.
         *
         * @param  String  selector  A CSS3 selector
         * @return Boolean
         */
        exists: function(selector) {
            return this.evaluate(function(selector) {
                return __utils__.exists(selector);
            }, { selector: selector });
        },

        /**
         * Checks if an element matching the provided CSS3 selector is visible
         * current page DOM by checking that offsetWidth and offsetHeight are
         * both non-zero.
         *
         * @param  String  selector  A CSS3 selector
         * @return Boolean
         */
        visible: function(selector) {
            return this.evaluate(function(selector) {
                return __utils__.visible(selector);
            }, { selector: selector });
        },

        /**
         * Exits phantom.
         *
         * @param  Number  status  Status
         * @return Casper
         */
        exit: function(status) {
            phantom.exit(status);
            return this;
        },

        /**
         * Fetches innerText within the element(s) matching a given CSS3
         * selector.
         *
         * @param  String  selector  A CSS3 selector
         * @return String
         */
        fetchText: function(selector) {
            return this.evaluate(function(selector) {
                return __utils__.fetchText(selector);
            }, { selector: selector });
        },

        /**
         * Fills a form with provided field values.
         *
         * @param  String  selector  A CSS3 selector to the target form to fill
         * @param  Object  vals      Field values
         * @param  Boolean submit    Submit the form?
         */
        fill: function(selector, vals, submit) {
            submit = submit === true ? submit : false;
            if (!isType(selector, "string") || !selector.length) {
                throw new Error("Form selector must be a non-empty string");
            }
            if (!isType(vals, "object")) {
                throw new Error("Form values must be provided as an object");
            }
            var fillResults = this.evaluate(function(selector, values) {
               return __utils__.fill(selector, values);
            }, {
                selector: selector,
                values:   vals
            });
            if (!fillResults) {
                throw new Error("Unable to fill form");
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
                    var form = document.querySelector(selector);
                    var method = form.getAttribute('method').toUpperCase() || "GET";
                    var action = form.getAttribute('action') || "unknown";
                    __utils__.log('submitting form to ' + action + ', HTTP ' + method, 'info');
                    form.submit();
                }, { selector: selector });
            }
        },

        /**
         * Go a step forward in browser's history
         *
         * @return Casper
         */
        forward: function(then) {
            return this.then(function(self) {
                self.evaluate(function() {
                    history.forward();
                });
            });
        },

        /**
         * Retrieves current document url.
         *
         * @return String
         */
        getCurrentUrl: function() {
            return decodeURIComponent(this.evaluate(function() {
                return document.location.href;
            }));
        },

        /**
         * Retrieves global variable.
         *
         * @param  String  name  The name of the global variable to retrieve
         * @return mixed
         */
        getGlobal: function(name) {
            var result = this.evaluate(function(name) {
                var result = {};
                try {
                    result.value = JSON.stringify(window[name]);
                } catch (e) {
                    var message = 'Unable to JSON encode window.' + name + ': ' + e;
                    __utils__.log(message, "error");
                    result.error = message;
                }
                return result;
            }, {'name': name});
            if ('error' in result) {
                throw new Error(result.error);
            } else if (isType(result.value, "string")) {
                return JSON.parse(result.value);
            } else {
                return undefined;
            }
        },

        /**
         * Retrieves current page title, if any.
         *
         * @return String
         */
        getTitle: function() {
            return this.evaluate(function() {
                return document.title;
            });
        },

        /**
         * Logs a message.
         *
         * @param  String  message  The message to log
         * @param  String  level    The log message level (from Casper.logLevels property)
         * @param  String  space    Space from where the logged event occured (default: "phantom")
         * @return Casper
         */
        log: function(message, level, space) {
            level = level && this.logLevels.indexOf(level) > -1 ? level : "debug";
            space = space ? space : "phantom";
            if (level === "error" && isType(this.options.onError, "function")) {
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
            if (level in this.logFormats && isType(this.logFormats[level], "function")) {
                message = this.logFormats[level](message, level, space);
            } else {
                var levelStr = this.colorizer.colorize('[' + level + ']', this.logStyles[level]);
                message = levelStr + ' [' + space + '] ' + message;
            }
            if (this.options.verbose) {
                this.echo(message); // direct output
            }
            this.result.log.push(entry);
            return this;
        },

        /**
         * Opens a page. Takes only one argument, the url to open (using the
         * callback argument would defeat the whole purpose of Casper
         * actually).
         *
         * @param  String  location  The url to open
         * @return Casper
         */
        open: function(location, options) {
            options = isType(options, "object") ? options : {};
            this.requestUrl = location;
            // http auth
            var httpAuthMatch = location.match(/^https?:\/\/(.+):(.+)@/i);
            if (httpAuthMatch) {
                this.setHttpAuth(httpAuthMatch[1], httpAuthMatch[2]);
            }
            this.page.open(location);
            return this;
        },

        /**
         * Repeats a step a given number of times.
         *
         * @param  Number    times  Number of times to repeat step
         * @aram   function  then   The step closure
         * @return Casper
         * @see    Casper#then
         */
        repeat: function(times, then) {
            for (var i = 0; i < times; i++) {
                this.then(then);
            }
            return this;
        },

        /**
         * Checks if a given resource was loaded by the remote page.
         *
         * @param  Function/String  test  A test function or string. In case a string is passed, url matching will be tested.
         * @return Boolean
         */
        resourceExists: function(test) {
            var testFn;
            if (isType(test, "string")) {
                testFn = function (res) {
                    return res.url.search(test) !== -1;
                };
            } else {
              testFn = test;
            }
            return this.resources.some(testFn);
        },

        /**
         * Runs the whole suite of steps.
         *
         * @param  function  onComplete  an optional callback
         * @param  Number    time        an optional amount of milliseconds for interval checking
         * @return Casper
         */
        run: function(onComplete, time) {
            if (!this.steps || this.steps.length < 1) {
                this.log("No steps defined, aborting", "error");
                return this;
            }
            this.log("Running suite: " + this.steps.length + " step" + (this.steps.length > 1 ? "s" : ""), "info");
            this.checker = setInterval(this.checkStep, (time ? time: 250), this, onComplete);
            return this;
        },

        /**
         * Runs a step.
         *
         * @param  Function  step
         */
        runStep: function(step) {
            var skipLog = isType(step.options, "object") && step.options.skipLog === true;
            var stepInfo = "Step " + (this.step) + "/" + this.steps.length;
            var stepResult;
            if (!skipLog) {
                this.log(stepInfo + ' ' + this.getCurrentUrl() + ' (HTTP ' + this.currentHTTPStatus + ')', "info");
            }
            if (isType(this.options.stepTimeout, "number") && this.options.stepTimeout > 0) {
                var stepTimeoutCheckInterval = setInterval(function(self, start, stepNum) {
                    if (new Date().getTime() - start > self.options.stepTimeout) {
                        if (self.step == stepNum) {
                            if (isType(self.options.onStepTimeout, "function")) {
                                self.options.onStepTimeout.call(self, self);
                            } else {
                                self.die("Maximum step execution timeout exceeded for step " + stepNum, "error");
                            }
                        }
                        clearInterval(stepTimeoutCheckInterval);
                    }
                }, this.options.stepTimeout, this, new Date().getTime(), this.step);
            }
            try {
                stepResult = step.call(this, this);
            } catch (e) {
                if (this.options.faultTolerant) {
                    this.log("Step error: " + e, "error");
                } else {
                    throw e;
                }
            }
            if (isType(this.options.onStepComplete, "function")) {
                this.options.onStepComplete.call(this, this, stepResult);
            }
            if (!skipLog) {
                this.log(stepInfo + ": done in " + (new Date().getTime() - this.startTime) + "ms.", "info");
            }
        },

        /**
         * Sets HTTP authentication parameters.
         *
         * @param  String   username  The HTTP_AUTH_USER value
         * @param  String   password  The HTTP_AUTH_PW value
         * @return Casper
         */
        setHttpAuth: function(username, password) {
            if (!this.started) {
                throw new Error("Casper must be started in order to use the setHttpAuth() method");
            }
            if (!isType(username, "string") || !isType(password, "string")) {
                throw new Error("Both username and password must be strings");
            }
            this.page.settings.userName = username;
            this.page.settings.password = password;
            this.log("Setting HTTP authentication for user " + username, "info");
            return this;
        },

        /**
         * Configures and starts Casper.
         *
         * @param  String   location  An optional location to open on start
         * @param  function then      Next step function to execute on page loaded (optional)
         * @return Casper
         */
        start: function(location, then) {
            this.log('Starting...', "info");
            this.startTime = new Date().getTime();
            this.history = [];
            this.steps = [];
            this.step = 0;
            // Option checks
            if (this.logLevels.indexOf(this.options.logLevel) < 0) {
                this.log("Unknown log level '" + this.options.logLevel + "', defaulting to 'warning'", "warning");
                this.options.logLevel = "warning";
            }
            // WebPage
            if (!isWebPage(this.page)) {
                if (isWebPage(this.options.page)) {
                    this.page = this.options.page;
                } else {
                    this.page = createPage(this);
                }
            }
            this.page.settings = mergeObjects(this.page.settings, this.options.pageSettings);
            if (isType(this.options.clipRect, "object")) {
                this.page.clipRect = this.options.clipRect;
            }
            if (isType(this.options.viewportSize, "object")) {
                this.page.viewportSize = this.options.viewportSize;
            }
            this.started = true;
            if (isType(this.options.timeout, "number") && this.options.timeout > 0) {
                this.log("Execution timeout set to " + this.options.timeout + 'ms', "info");
                setTimeout(function(self) {
                    if (isType(self.options.onTimeout, "function")) {
                        self.options.onTimeout.call(self, self);
                    } else {
                        self.die("Timeout of " + self.options.timeout + "ms exceeded, exiting.");
                    }
                }, this.options.timeout, this);
            }
            if (isType(this.options.onPageInitialized, "function")) {
                this.log("Post-configuring WebPage instance", "debug");
                this.options.onPageInitialized.call(this, this.page);
            }
            if (isType(location, "string") && location.length > 0) {
                return this.thenOpen(location, isType(then, "function") ? then : this.createStep(function(self) {
                    self.log("start page is loaded", "debug");
                }));
            }
            return this;
        },

        /**
         * Schedules the next step in the navigation process.
         *
         * @param  function  step  A function to be called as a step
         * @return Casper
         */
        then: function(step) {
            if (!this.started) {
                throw new Error("Casper not started; please use Casper#start");
            }
            if (!isType(step, "function")) {
                throw new Error("You can only define a step as a function");
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
            return this;
        },

        /**
         * Adds a new navigation step for clicking on a provided link selector
         * and execute an optional next step.
         *
         * @param  String   selector        A DOM CSS3 compatible selector
         * @param  Function then            Next step function to execute on page loaded (optional)
         * @param  Boolean  fallbackToHref  Whether to try to relocate to the value of any href attribute (default: true)
         * @return Casper
         * @see    Casper#click
         * @see    Casper#then
         */
        thenClick: function(selector, then, fallbackToHref) {
            this.then(function(self) {
                self.click(selector, fallbackToHref);
            });
            return isType(then, "function") ? this.then(then) : this;
        },

        /**
         * Adds a new navigation step to perform code evaluation within the
         * current retrieved page DOM.
         *
         * @param  function  fn       The function to be evaluated within current page DOM
         * @param  object    context  Optional function parameters context
         * @return Casper
         * @see    Casper#evaluate
         */
        thenEvaluate: function(fn, context) {
            return this.then(function(self) {
                self.evaluate(fn, context);
            });
        },

        /**
         * Adds a new navigation step for opening the provided location.
         *
         * @param  String   location  The URL to load
         * @param  function then      Next step function to execute on page loaded (optional)
         * @return Casper
         * @see    Casper#open
         */
        thenOpen: function(location, then) {
            this.then(this.createStep(function(self) {
                self.open(location);
            }, {
                skipLog: true
            }));
            return isType(then, "function") ? this.then(then) : this;
        },

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
        thenOpenAndEvaluate: function(location, fn, context) {
            return this.thenOpen(location).thenEvaluate(fn, context);
        },

        /**
         * Changes the current viewport size.
         *
         * @param  Number  width   The viewport width, in pixels
         * @param  Number  height  The viewport height, in pixels
         * @return Casper
         */
        viewport: function(width, height) {
            if (!this.started) {
                throw new Error("Casper must be started in order to set viewport at runtime");
            }
            if (!isType(width, "number") || !isType(height, "number") || width <= 0 || height <= 0) {
                throw new Error("Invalid viewport width/height set: " + width + 'x' + height);
            }
            this.page.viewportSize = {
                width: width,
                height: height
            };
            return this;
        },

        /**
         * Adds a new step that will wait for a given amount of time (expressed
         * in milliseconds) before processing an optional next one.
         *
         * @param  Number    timeout  The max amount of time to wait, in milliseconds
         * @param  Function  then     Next step to process (optional)
         * @return Casper
         */
        wait: function(timeout, then) {
            timeout = Number(timeout, 10);
            if (!isType(timeout, "number") || timeout < 1) {
                this.die("wait() only accepts a positive integer > 0 as a timeout value");
            }
            if (then && !isType(then, "function")) {
                this.die("wait() a step definition must be a function");
            }
            return this.then(function(self) {
                self.waitStart();
                setTimeout(function() {
                  self.log("wait() finished wating for " + timeout + "ms.", "info");
                  if (then) {
                    then.call(self, self);
                  }
                  self.waitDone();
                }, timeout);
            });
        },

        waitStart: function() {
            this.pendingWait = true;
        },

        waitDone: function() {
            this.pendingWait = false;
        },

        /**
         * Waits until a function returns true to process a next step.
         *
         * @param  Function  testFx     A function to be evaluated for returning condition satisfecit
         * @param  Function  then       The next step to perform (optional)
         * @param  Function  onTimeout  A callback function to call on timeout (optional)
         * @param  Number    timeout    The max amount of time to wait, in milliseconds (optional)
         * @return Casper
         */
        waitFor: function(testFx, then, onTimeout, timeout) {
            timeout = timeout ? timeout : this.defaultWaitTimeout;
            if (!isType(testFx, "function")) {
                this.die("waitFor() needs a test function");
            }
            if (then && !isType(then, "function")) {
                this.die("waitFor() next step definition must be a function");
            }
            return this.then(function(self) {
                self.waitStart();
                var start = new Date().getTime();
                var condition = false;
                var interval = setInterval(function(self, testFx, timeout, onTimeout) {
                    if ((new Date().getTime() - start < timeout) && !condition) {
                        condition = testFx(self);
                    } else {
                        self.waitDone();
                        if (!condition) {
                            self.log("Casper.waitFor() timeout", "warning");
                            if (isType(onTimeout, "function")) {
                                onTimeout.call(self, self);
                            } else {
                                self.die("Timeout of " + timeout + "ms expired, exiting.", "error");
                            }
                            clearInterval(interval);
                        } else {
                            self.log("waitFor() finished in " + (new Date().getTime() - start) + "ms.", "info");
                            if (then) {
                                self.then(then);
                            }
                            clearInterval(interval);
                        }
                    }
              }, 100, self, testFx, timeout, onTimeout);
            });
        },

        /**
         * Waits until a given resource is loaded
         *
         * @param  String/Function  test       A function to test if the resource exists. A string will be matched against the resources url.
         * @param  Function         then       The next step to perform (optional)
         * @param  Function         onTimeout  A callback function to call on timeout (optional)
         * @param  Number           timeout    The max amount of time to wait, in milliseconds (optional)
         * @return Casper
         */
        waitForResource: function(test, then, onTimeout, timeout) {
            timeout = timeout ? timeout : this.defaultWaitTimeout;
            return this.waitFor(function(self) {
                return self.resourceExists(test);
            }, then, onTimeout, timeout);
        },

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
        waitForSelector: function(selector, then, onTimeout, timeout) {
            timeout = timeout ? timeout : this.defaultWaitTimeout;
            return this.waitFor(function(self) {
                return self.exists(selector);
            }, then, onTimeout, timeout);
        },

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
        waitWhileSelector: function(selector, then, onTimeout, timeout) {
            timeout = timeout ? timeout : this.defaultWaitTimeout;
            return this.waitFor(function(self) {
                return !self.exists(selector);
            }, then, onTimeout, timeout);
        },

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
        waitUntilVisible: function(selector, then, onTimeout, timeout) {
            timeout = timeout ? timeout : this.defaultWaitTimeout;
            return this.waitFor(function(self) {
                return self.visible(selector);
            }, then, onTimeout, timeout);
        },

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
        waitWhileVisible: function(selector, then, onTimeout, timeout) {
            timeout = timeout ? timeout : this.defaultWaitTimeout;
            return this.waitFor(function(self) {
                return !self.visible(selector);
            }, then, onTimeout, timeout);
        }
    };

    /**
     * Extends Casper's prototype with provided one.
     *
     * @param  Object  proto  Prototype methods to add to Casper
     */
    phantom.Casper.extend = function(proto) {
        if (!isType(proto, "object")) {
            throw new Error("extends() only accept objects as prototypes");
        }
        mergeObjects(phantom.Casper.prototype, proto);
    };
})(phantom);
