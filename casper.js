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
            pageSettings:        { userAgent: DEFAULT_USER_AGENT },
            stepTimeout:         null,
            timeout:             null,
            verbose:             false
        };
        // privates
        // local properties
        this.checker = null;
        this.colorizer = new phantom.Casper.Colorizer();
        this.currentUrl = 'about:blank';
        this.currentHTTPStatus = 200;
        this.defaultWaitTimeout = 5000;
        this.delayedExecution = false;
        this.history = [];
        this.loadInProgress = false;
        this.logLevels = ["debug", "info", "warning", "error"];
        this.logStyles = {
            debug:   'INFO',
            info:    'PARAMETER',
            warning: 'COMMENT',
            error:   'ERROR'
        };
        this.options = mergeObjects(this.defaults, options);
        this.page = null;
        this.requestUrl = 'about:blank';
        this.result = {
            log:    [],
            status: "success",
            time:   0
        };
        this.started = false;
        this.step = 0;
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
         * @param  String  url  The url to download
         * @return string       Base64 encoded result
         */
        base64encode: function(url) {
            return this.evaluate(function() {
                return __utils__.getBase64(__casper_params__.url);
            }, {
                url: url
            });
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
            try {
                this.page.render(targetFile);
            } catch (e) {
                this.log('Failed to capture screenshot as ' + targetFile + ': ' + e, "error");
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
            return this.capture(targetFile, this.evaluate(function() {
                try {
                    var clipRect = document.querySelector(__casper_params__.selector).getBoundingClientRect();
                    return {
                        top:    clipRect.top,
                        left:   clipRect.left,
                        width:  clipRect.width,
                        height: clipRect.height
                    };
                } catch (e) {
                    __utils__.log("Unable to fetch bounds for element " + __casper_params__.selector, "warning");
                }
            }, {
                selector: selector
            }));
        },

        /**
         * Checks for any further navigation step to process.
         *
         * @param  Casper    self        A self reference
         * @param  function  onComplete  An options callback to apply on completion
         */
        checkStep: function(self, onComplete) {
            var step = self.steps[self.step];
            if (!self.loadInProgress && isType(step, "function")) {
                self.runStep(step);
            }
            if (!isType(step, "function") && !self.delayedExecution) {
                self.result.time = new Date().getTime() - self.startTime;
                self.log("Done " + self.steps.length + " steps in " + self.result.time + 'ms.', "info");
                clearInterval(self.checker);
                if (isType(onComplete, "function")) {
                    try {
                        onComplete.call(self, self);
                    } catch (err) {
                        self.log("could not complete final step: " + err, "error");
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
            this.log("click on selector: " + selector, "debug");
            return this.evaluate(function() {
                return __utils__.click(__casper_params__.selector, __casper_params__.fallbackToHref);
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
                throw "createStep(): a step definition must be a function";
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
         * Iterates over the values of a provided array and execute a callback
         * for each item.
         *
         * @param  Array     array
         * @param  Function  fn     Callback: function(self, item, index)
         * @return Casper
         */
        each: function(array, fn) {
            if (!isType(array, "array")) {
                self.log("each() only works with arrays", "error");
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
         * WebPage#evaluate does, but can also replace values by their
         * placeholer names:
         *
         *     casper.evaluate(function() {
         *         document.querySelector('#username').value = '%username%';
         *         document.querySelector('#password').value = '%password%';
         *         document.querySelector('#submit').click();
         *     }, {
         *         username: 'Bazoonga',
         *         password: 'baz00nga'
         *     })
         *
         * As an alternative, CasperJS injects a `__casper_params__` Object
         * instance containing all the parameters you passed:
         *
         *     casper.evaluate(function() {
         *         document.querySelector('#username').value = __casper_params__.username;
         *         document.querySelector('#password').value = __casper_params__.password;
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
         * @param  function  fn            The function to be evaluated within current page DOM
         * @param  object    replacements  Parameters to pass to the remote environment
         * @return mixed
         * @see    WebPage#evaluate
         */
        evaluate: function(fn, replacements) {
            replacements = isType(replacements, "object") ? replacements : {};
            this.page.evaluate(replaceFunctionPlaceholders(function() {
                window.__casper_params__ = {};
                try {
                    var jsonString = unescape(decodeURIComponent('%replacements%'));
                    window.__casper_params__ = JSON.parse(jsonString);
                } catch (e) {
                    __utils__.log("Unable to replace parameters: " + e, "error");
                }
            }, {
                replacements: encodeURIComponent(escape(JSON.stringify(replacements).replace("'", "\'")))
            }));
            return this.page.evaluate(replaceFunctionPlaceholders(fn, replacements));
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
            return this.evaluate(function() {
                return __utils__.exists(__casper_params__.selector);
            }, {
                selector: selector
            });
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
            return this.evaluate(function() {
                return __utils__.fetchText(__casper_params__.selector);
            }, {
                selector: selector
            });
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
                throw "form selector must be a non-empty string";
            }
            if (!isType(vals, "object")) {
                throw "form values must be provided as an object";
            }
            var fillResults = this.evaluate(function() {
               return __utils__.fill(__casper_params__.selector, __casper_params__.values);
            }, {
                selector: selector,
                values:   vals
            });
            if (!fillResults) {
                throw "unable to fill form";
            } else if (fillResults.errors.length > 0) {
                (function(self){
                    fillResults.errors.forEach(function(error) {
                        self.log("form error: " + error, "error");
                    });
                })(this);
                if (submit) {
                    this.log("errors encountered while filling form; submission aborted", "warning");
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
                this.evaluate(function() {
                    var form = document.querySelector(__casper_params__.selector);
                    var method = form.getAttribute('method').toUpperCase() || "GET";
                    var action = form.getAttribute('action') || "unknown";
                    __utils__.log('submitting form to ' + action + ', HTTP ' + method, 'info');
                    form.submit();
                }, {
                    selector: selector
                });
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
            return this.evaluate(function() {
                return window[window.__casper_params__.name];
            }, {'name': name});
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
            if (this.options.verbose) {
                var levelStr = this.colorizer.colorize('[' + level + ']', this.logStyles[level]);
                this.echo(levelStr + ' [' + space + '] ' + message); // direct output
            }
            this.result.log.push({
                level:   level,
                space:   space,
                message: message,
                date:    new Date().toString()
            });
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
            var stepInfo = "Step " + (this.step + 1) + "/" + this.steps.length;
            var stepResult;
            if (!skipLog) {
                this.log(stepInfo + ' ' + this.getCurrentUrl() + ' (HTTP ' + this.currentHTTPStatus + ')', "info");
            }
            if (isType(this.options.stepTimeout, "number") && this.options.stepTimeout > 0) {
                var stepTimeoutCheckInterval = setInterval(function(self, start, stepNum) {
                    if (new Date().getTime() - start > self.options.stepTimeout) {
                        if (self.step == stepNum + 1) {
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
            this.step++;
        },

        /**
         * Configures and starts Casper.
         *
         * @param  String   location  An optional location to open on start
         * @param  function then      Next step function to execute on page loaded (optional)
         * @return Casper
         */
        start: function(location, then) {
            if (this.started) {
                this.log("start failed: Casper has already started!", "error");
            }
            this.log('Starting...', "info");
            this.startTime = new Date().getTime();
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
                if (isType(then, "function")) {
                    return this.open(location).then(then);
                } else {
                    return this.open(location);
                }
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
                throw "Casper not started; please use Casper#start";
            }
            if (!isType(step, "function")) {
                throw "You can only define a step as a function";
            }
            this.steps.push(step);
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
         * @param  function  fn            The function to be evaluated within current page DOM
         * @param  object    replacements  Optional replacements to performs, eg. for '%foo%' => {foo: 'bar'}
         * @return Casper
         * @see    Casper#evaluate
         */
        thenEvaluate: function(fn, replacements) {
            return this.then(function(self) {
                self.evaluate(fn, replacements);
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
         * @param  String    location      The url to open
         * @param  function  fn            The function to be evaluated within current page DOM
         * @param  object    replacements  Optional replacements to performs, eg. for '%foo%' => {foo: 'bar'}
         * @return Casper
         * @see    Casper#evaluate
         * @see    Casper#open
         */
        thenOpenAndEvaluate: function(location, fn, replacements) {
            return this.thenOpen(location).thenEvaluate(fn, replacements);
        },

        /**
         * Changes the current viewport size.
         *
         * @param  Number  width   The viewport width, in pixels
         * @param  Number  height  The viewport height, in pixels
         * @return Casper
         */
        viewport: function(width, height) {
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
                self.delayedExecution = true;
                var start = new Date().getTime();
                var interval = setInterval(function(self, then) {
                    if (new Date().getTime() - start > timeout) {
                        self.delayedExecution = false;
                        self.log("wait() finished wating for " + timeout + "ms.", "info");
                        if (then) {
                            self.then(then);
                        }
                        clearInterval(interval);
                    }
                }, 100, self, then);
            });
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
            this.delayedExecution = true;
            var start = new Date().getTime();
            var condition = false;
            var interval = setInterval(function(self, testFx, onTimeout) {
                if ((new Date().getTime() - start < timeout) && !condition) {
                    condition = testFx(self);
                } else {
                    self.delayedExecution = false;
                    if (!condition) {
                        self.log("Casper.waitFor() timeout", "warning");
                        if (isType(onTimeout, "function")) {
                            onTimeout.call(self, self);
                        } else {
                            self.die("Expired timeout, exiting.", "error");
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
            }, 100, this, testFx, onTimeout);
            return this;
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
        }
    };

    /**
     * Extends Casper's prototype with provided one.
     *
     * @param  Object  proto  Prototype methods to add to Casper
     */
    phantom.Casper.extend = function(proto) {
        if (!isType(proto, "object")) {
            throw "extends() only accept objects as prototypes";
        }
        mergeObjects(phantom.Casper.prototype, proto);
    };

    /**
     * Casper client-side helpers.
     */
    phantom.Casper.ClientUtils = function() {
        /**
         * Clicks on the DOM element behind the provided selector.
         *
         * @param  String  selector        A CSS3 selector to the element to click
         * @param  Boolean fallbackToHref  Whether to try to relocate to the value of any href attribute (default: true)
         * @return Boolean
         */
        this.click = function(selector, fallbackToHref) {
            fallbackToHref = typeof fallbackToHref === "undefined" ? true : !!fallbackToHref;
            var elem = this.findOne(selector);
            if (!elem) {
                return false;
            }
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", true, true, window, 1, 1, 1, 1, 1, false, false, false, false, 0, elem);
            if (elem.dispatchEvent(evt)) {
                return true;
            }
            if (fallbackToHref && elem.hasAttribute('href')) {
                document.location = elem.getAttribute('href');
                return true;
            }
            return false;
        };

        /**
         * Base64 encodes a string, even binary ones. Succeeds where
         * window.btoa() fails.
         *
         * @param  String  str
         * @return string
         */
        this.encode = function(str) {
            var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var out = "", i = 0, len = str.length, c1, c2, c3;
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    out += CHARS.charAt(c1 >> 2);
                    out += CHARS.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    out += CHARS.charAt(c1 >> 2);
                    out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                    out += CHARS.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                out += CHARS.charAt(c3 & 0x3F);
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
         * @param  String  url  The resource url
         * @return String       Base64 contents string
         */
        this.getBase64 = function(url) {
            return this.encode(this.getBinary(url));
        };

        /**
         * Retrieves string contents from a binary file behind an url. Silently
         * fails but log errors.
         *
         * @param  String  url
         * @return string
         */
        this.getBinary = function(url) {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
                xhr.send(null);
                return xhr.responseText;
            } catch (e) {
                if (e.name === "NETWORK_ERR" && e.code === 101) {
                    this.log("unfortunately, casperjs cannot make cross domain ajax requests", "warning");
                }
                this.log("error while fetching " + url + ": " + e, "error");
                return "";
            }
        };

        /**
         * Logs a message.
         *
         * @param  String  message
         * @param  String  level
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
                this.log("invalid field type; only HTMLElement and NodeList are supported", "error");
            }
            this.log('set "' + field.getAttribute('name') + '" field value to ' + value, "debug");
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
                            field.setAttribute('checked', value ? "checked" : "");
                            break;
                        case "file":
                            throw {
                                name:    "FileUploadError",
                                message: "file field must be filled using page.uploadFile",
                                path:    value
                            };
                        case "radio":
                            if (fields) {
                                Array.prototype.forEach.call(fields, function(e) {
                                    e.checked = (e.value === value);
                                });
                            } else {
                                out = 'provided radio elements are empty';
                            }
                            break;
                        default:
                            out = "unsupported input field type: " + type;
                            break;
                    }
                    break;
                case "select":
                case "textarea":
                    field.value = value;
                    break;
                default:
                    out = 'unsupported field type: ' + nodeName;
                    break;
            }
            try {
                field.blur();
            } catch (err) {
                __utils__.log("Unable to blur() input field " + field.getAttribute('name') + ": " + err, "warning");
            }
            return out;
        };
    };

    /**
     * This is a port of lime colorizer.
     * http://trac.symfony-project.org/browser/tools/lime/trunk/lib/lime.php)
     *
     * (c) Fabien Potencier, Symfony project, MIT license
     */
    phantom.Casper.Colorizer = function() {
        var options    = { bold: 1, underscore: 4, blink: 5, reverse: 7, conceal: 8 };
        var foreground = { black: 30, red: 31, green: 32, yellow: 33, blue: 34, magenta: 35, cyan: 36, white: 37 };
        var background = { black: 40, red: 41, green: 42, yellow: 43, blue: 44, magenta: 45, cyan: 46, white: 47 };
        var styles     = {
            'ERROR':     { bg: 'red', fg: 'white', bold: true },
            'INFO':      { fg: 'green', bold: true },
            'TRACE':     { fg: 'green', bold: true },
            'PARAMETER': { fg: 'cyan' },
            'COMMENT':   { fg: 'yellow' },
            'WARNING':   { fg: 'red', bold: true },
            'GREEN_BAR': { fg: 'white', bg: 'green', bold: true },
            'RED_BAR':   { fg: 'white', bg: 'red', bold: true },
            'INFO_BAR':  { fg: 'cyan', bold: true }
        };

        /**
         * Adds a style to provided text.
         *
         * @params  String  text
         * @params  String  styleName
         * @return  String
         */
        this.colorize = function(text, styleName) {
            if (styleName in styles) {
                return this.format(text, styles[styleName]);
            }
            return text;
        };

        /**
         * Formats a text using a style declaration object.
         *
         * @param  String  text
         * @param  Object  style
         * @return String
         */
        this.format = function(text, style) {
            if (typeof style !== "object") {
                return text;
            }
            var codes = [];
            if (style.fg && foreground[style.fg]) {
                codes.push(foreground[style.fg]);
            }
            if (style.bg && background[style.bg]) {
                codes.push(background[style.bg]);
            }
            for (var option in options) {
                if (style[option] === true) {
                    codes.push(options[option]);
                }
            }
            return "\033[" + codes.join(';') + 'm' + text + "\033[0m";
        };
    };

    /**
     * Casper tester: makes assertions, stores test results and display then.
     *
     */
    phantom.Casper.Tester = function(casper, options) {
        this.options = isType(options, "object") ? options : {};
        if (!casper instanceof phantom.Casper) {
            throw "phantom.Casper.Tester needs a phantom.Casper instance";
        }

        // locals
        var exporter = new phantom.Casper.XUnitExporter();
        var PASS = this.options.PASS || "PASS";
        var FAIL = this.options.FAIL || "FAIL";

        // properties
        this.testResults = {
            passed: 0,
            failed: 0
        };

        // methods
        /**
         * Asserts a condition resolves to true.
         *
         * @param  Boolean  condition
         * @param  String   message    Test description
         */
        this.assert = function(condition, message) {
            var status = PASS;
            if (condition === true) {
                style = 'INFO';
                this.testResults.passed++;
                exporter.addSuccess("unknown", message);
            } else {
                status = FAIL;
                style = 'RED_BAR';
                this.testResults.failed++;
                exporter.addFailure("unknown", message, 'test failed', "assert");
            }
            casper.echo([this.colorize(status, style), this.formatMessage(message)].join(' '));
        };

        /**
         * Asserts that two values are strictly equals.
         *
         * @param  Boolean  testValue  The value to test
         * @param  Boolean  expected   The expected value
         * @param  String   message    Test description
         */
        this.assertEquals = function(testValue, expected, message) {
            if (expected === testValue) {
                casper.echo(this.colorize(PASS, 'INFO') + ' ' + this.formatMessage(message));
                this.testResults.passed++;
                exporter.addSuccess("unknown", message);
            } else {
                casper.echo(this.colorize(FAIL, 'RED_BAR') + ' ' + this.formatMessage(message, 'WARNING'));
                this.comment('   got:      ' + testValue);
                this.comment('   expected: ' + expected);
                this.testResults.failed++;
                exporter.addFailure("unknown", message, "test failed; expected: " + expected + "; got: " + testValue, "assertEquals");
            }
        };

        /**
         * Asserts that a code evaluation in remote DOM resolves to true.
         *
         * @param  Function  fn         A function to be evaluated in remote DOM
         * @param  String    message    Test description
         */
        this.assertEval = function(fn, message) {
            return this.assert(casper.evaluate(fn), message);
        };

        /**
         * Asserts that the result of a code evaluation in remote DOM equals
         * an expected value.
         *
         * @param  Function fn         The function to be evaluated in remote DOM
         * @param  Boolean  expected   The expected value
         * @param  String   message    Test description
         */
        this.assertEvalEquals = function(fn, expected, message) {
            return this.assertEquals(casper.evaluate(fn), expected, message);
        };

        /**
         * Asserts that an element matching the provided CSS3 selector exists in
         * remote DOM.
         *
         * @param  String   selector   CSS3 selectore
         * @param  String   message    Test description
         */
        this.assertExists = function(selector, message) {
            return this.assert(casper.exists(selector), message);
        };

        /**
         * Asserts that a provided string matches a provided RegExp pattern.
         *
         * @param  String   subject    The string to test
         * @param  RegExp   pattern    A RegExp object instance
         * @param  String   message    Test description
         */
        this.assertMatch = function(subject, pattern, message) {
            if (pattern.test(subject)) {
                casper.echo(this.colorize(PASS, 'INFO') + ' ' + this.formatMessage(message));
                this.testResults.passed++;
                exporter.addSuccess("unknown", message);
            } else {
                casper.echo(this.colorize(FAIL, 'RED_BAR') + ' ' + this.formatMessage(message, 'WARNING'));
                this.comment('   subject: ' + subject);
                this.comment('   pattern: ' + pattern.toString());
                this.testResults.failed++;
                exporter.addFailure("unknown", message, "test failed; subject: " + subject + "; pattern: " + pattern.toString(), "assertMatch");
            }
        };

        /**
         * Asserts that the provided function called with the given parameters
         * will raise an exception.
         *
         * @param  Function  fn       The function to test
         * @param  Array     args     The arguments to pass to the function
         * @param  String    message  Test description
         */
        this.assertRaises = function(fn, args, message) {
            try {
                fn.apply(null, args);
                this.fail(message);
            } catch (e) {
                this.pass(message);
            }
        };

        /**
         * Asserts that at least an element matching the provided CSS3 selector
         * exists in remote DOM.
         *
         * @param  String   selector   A CSS3 selector string
         * @param  String   message    Test description
         */
        this.assertSelectorExists = function(selector, message) {
            return this.assert(this.exists(selector), message);
        };

        /**
         * Asserts that title of the remote page equals to the expected one.
         *
         * @param  String  expected   The expected title string
         * @param  String  message    Test description
         */
        this.assertTitle = function(expected, message) {
            return this.assertEquals(casper.getTitle(), expected, message);
        };

        /**
         * Asserts that the provided input is of the given type.
         *
         * @param  mixed   input    The value to test
         * @param  String  type     The javascript type name
         * @param  String  message  Test description
         */
        this.assertType = function(input, type, message) {
            return this.assertEquals(betterTypeOf(input), type, message);
        };

        /**
         * Asserts that a the current page url matches the provided RegExp
         * pattern.
         *
         * @param  RegExp   pattern    A RegExp object instance
         * @param  String   message    Test description
         */
        this.assertUrlMatch = function(pattern, message) {
            return this.assertMatch(casper.getCurrentUrl(), pattern, message);
        };

        /**
         * Render a colorized output. Basically a proxy method for
         * Casper.Colorizer#colorize()
         */
        this.colorize = function(message, style) {
            return casper.colorizer.colorize(message, style);
        };

        /**
         * Writes a comment-style formatted message to stdout.
         *
         * @param  String  message
         */
        this.comment = function(message) {
            casper.echo('# ' + message, 'COMMENT');
        };

        /**
         * Writes an error-style formatted message to stdout.
         *
         * @param  String  message
         */
        this.error = function(message) {
            casper.echo(message, 'ERROR');
        };

        /**
         * Adds a failed test entry to the stack.
         *
         * @param  String  message
         */
        this.fail = function(message) {
            this.assert(false, message);
        };

        /**
         * Formats a message to highlight some parts of it.
         *
         * @param  String  message
         * @param  String  style
         */
        this.formatMessage = function(message, style) {
            var parts = /([a-z0-9_\.]+\(\))(.*)/i.exec(message);
            if (!parts) {
                return message;
            }
            return this.colorize(parts[1], 'PARAMETER') + this.colorize(parts[2], style);
        };

        /**
         * Writes an info-style formatted message to stdout.
         *
         * @param  String  message
         */
        this.info = function(message) {
            casper.echo(message, 'PARAMETER');
        };

        /**
         * Adds a successful test entry to the stack.
         *
         * @param  String  message
         */
        this.pass = function(message) {
            this.assert(true, message);
        };

        /**
         * Render tests results, an optionnaly exit phantomjs.
         *
         * @param  Boolean  exit
         */
        this.renderResults = function(exit, status, save) {
            save = isType(save, "string") ? save : this.options.save;
            var total = this.testResults.passed + this.testResults.failed, statusText, style, result;
            if (this.testResults.failed > 0) {
                statusText = FAIL;
                style = 'RED_BAR';
            } else {
                statusText = PASS;
                style = 'GREEN_BAR';
            }
            result = statusText + ' ' + total + ' tests executed, ' + this.testResults.passed + ' passed, ' + this.testResults.failed + ' failed.';
            if (result.length < 80) {
                result += new Array(80 - result.length + 1).join(' ');
            }
            casper.echo(this.colorize(result, style));
            if (save && isType(require, "function")) {
                try {
                    require('fs').write(save, exporter.getXML(), 'w');
                    casper.echo('result log stored in ' + save, 'INFO');
                } catch (e) {
                    casper.echo('unable to write results to ' + save + '; ' + e, 'ERROR');
                }
            }
            if (exit === true) {
                casper.exit(status || 0);
            }
        };
    };

    /**
     * JUnit XML (xUnit) exporter for test results.
     *
     */
    phantom.Casper.XUnitExporter = function() {
        var node = function(name, attributes) {
            var node = document.createElement(name);
            for (var attrName in attributes) {
                var value = attributes[attrName];
                if (attributes.hasOwnProperty(attrName) && isType(attrName, "string")) {
                    node.setAttribute(attrName, value);
                }
            }
            return node;
        };

        var xml = node('testsuite');
        xml.toString = function() {
            return this.outerHTML; // ouch
        };

        /**
         * Adds a successful test result
         *
         * @param  String  classname
         * @param  String  name
         */
        this.addSuccess = function(classname, name) {
            xml.appendChild(node('testcase', {
                classname: classname,
                name:      name
            }));
        };

        /**
         * Adds a failed test result
         *
         * @param  String  classname
         * @param  String  name
         * @param  String  message
         * @param  String  type
         */
        this.addFailure = function(classname, name, message, type) {
            var fnode = node('testcase', {
                classname: classname,
                name:      name
            });
            var failure = node('failure', {
                type: type || "unknown"
            });
            failure.appendChild(document.createTextNode(message || "no message left"));
            fnode.appendChild(failure);
            xml.appendChild(fnode);
        };

        /**
         * Retrieves generated XML object - actually an HTMLElement.
         *
         * @return HTMLElement
         */
        this.getXML = function() {
            return xml;
        };
    };

    /**
     * Provides a better typeof operator equivalent, able to retrieve the array
     * type.
     *
     * @param  mixed  input
     * @return String
     * @see    http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
     */
    function betterTypeOf(input) {
        try {
            return Object.prototype.toString.call(input).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
        } catch (e) {
            return typeof input;
        }
    }

    /**
     * Creates a new WebPage instance for Casper use.
     *
     * @param  Casper  casper  A Casper instance
     * @return WebPage
     */
    function createPage(casper) {
        var page;
        if (phantom.version.major <= 1 && phantom.version.minor < 3 && isType(require, "function")) {
            page = new WebPage();
        } else {
            page = require('webpage').create();
        }
        page.onAlert = function(message) {
            casper.log('[alert] ' + message, "info", "remote");
            if (isType(casper.options.onAlert, "function")) {
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
        };
        page.onLoadStarted = function() {
            casper.loadInProgress = true;
        };
        page.onLoadFinished = function(status) {
            if (status !== "success") {
                var message = 'Loading resource failed with status=' + status;
                if (casper.currentHTTPStatus) {
                    message += ' (HTTP ' + casper.currentHTTPStatus + ')';
                }
                message += ': ' + casper.requestUrl;
                casper.log(message, "warning");
                if (isType(casper.options.onLoadError, "function")) {
                    casper.options.onLoadError.call(casper, casper, casper.requestUrl, status);
                }
            }
            if (casper.options.clientScripts) {
                if (betterTypeOf(casper.options.clientScripts) !== "array") {
                    casper.log("The clientScripts option must be an array", "error");
                } else {
                    for (var i = 0; i < casper.options.clientScripts.length; i++) {
                        var script = casper.options.clientScripts[i];
                        if (casper.page.injectJs(script)) {
                            casper.log('Automatically injected ' + script + ' client side', "debug");
                        } else {
                            casper.log('Failed injecting ' + script + ' client side', "warning");
                        }
                    }
                }
            }
            // Client utils injection
            var injected = page.evaluate(replaceFunctionPlaceholders(function() {
                eval("var ClientUtils = " + decodeURIComponent("%utils%"));
                __utils__ = new ClientUtils();
                return __utils__ instanceof ClientUtils;
            }, {
                utils: encodeURIComponent(phantom.Casper.ClientUtils.toString())
            }));
            if (!injected) {
                casper.log("Failed to inject Casper client-side utilities!", "warning");
            } else {
                casper.log("Successfully injected Casper client-side utilities", "debug");
            }
            // history
            casper.history.push(casper.getCurrentUrl());
            casper.loadInProgress = false;
        };
        page.onResourceReceived = function(resource) {
            if (isType(casper.options.onResourceReceived, "function")) {
                casper.options.onResourceReceived.call(casper, casper, resource);
            }
            if (resource.url === casper.requestUrl && resource.stage === "start") {
                casper.currentHTTPStatus = resource.status;
                if (isType(casper.options.httpStatusHandlers, "object") && resource.status in casper.options.httpStatusHandlers) {
                    casper.options.httpStatusHandlers[resource.status](casper, resource);
                }
                casper.currentUrl = resource.url;
            }
        };
        page.onResourceRequested = function(request) {
            if (isType(casper.options.onResourceRequested, "function")) {
                casper.options.onResourceRequested.call(casper, casper, request);
            }
        };
        return page;
    }

    /**
     * Shorthands for checking if a value is of the given type. Can check for
     * arrays.
     *
     * @param  mixed   what      The value to check
     * @param  String  typeName  The type name ("string", "number", "function", etc.)
     * @return Boolean
     */
    function isType(what, typeName) {
        return betterTypeOf(what) === typeName;
    }

    /**
     * Checks if the provided var is a WebPage instance
     *
     * @param  mixed  what
     * @return Boolean
     */
    function isWebPage(what) {
        if (!what || !isType(what, "object")) {
            return false;
        }
        if (phantom.version.major <= 1 && phantom.version.minor < 3 && isType(require, "function")) {
            return what instanceof WebPage;
        } else {
            return what.toString().indexOf('WebPage(') === 0;
        }
    }

    /**
     * Object recursive merging utility.
     *
     * @param  Object  obj1  the destination object
     * @param  Object  obj2  the source object
     * @return Object
     */
    function mergeObjects(obj1, obj2) {
        for (var p in obj2) {
            try {
                if (obj2[p].constructor == Object) {
                    obj1[p] = mergeObjects(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch(e) {
              obj1[p] = obj2[p];
            }
        }
        return obj1;
    }

    /**
     * Replaces a function string contents with placeholders provided by an
     * Object.
     *
     * @param  Function  fn            The function
     * @param  Object    replacements  Object containing placeholder replacements
     * @return String                  A function string representation
     */
    function replaceFunctionPlaceholders(fn, replacements) {
        if (replacements && isType(replacements, "object")) {
            fn = fn.toString();
            for (var placeholder in replacements) {
                var match = '%' + placeholder + '%';
                do {
                    fn = fn.replace(match, replacements[placeholder]);
                } while(fn.indexOf(match) !== -1);
            }
        }
        return fn;
    }
})(phantom);
