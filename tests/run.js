phantom.injectJs('casper.js');

var casper = new phantom.Casper({
    faultTolerant: false,
    verbose: true
});
var fs = require('fs');
var save = null;

phantom.args.forEach(function(arg) {
    var debugMatch = /--loglevel=(\w+)/.exec(arg);
    if (debugMatch) {
        casper.options.logLevel = debugMatch[1];
    }
    var saveMatch = /--save=(.*)(\s|)/.exec(arg);
    if (saveMatch) {
        save = saveMatch[1];
    }
});

// phantom.Casper.FunctionArgsInjector
casper.test.comment('FunctionArgsInjector');
function createInjector(fn, values) {
    return new phantom.Casper.FunctionArgsInjector(fn, values);
}
var testFn = function(a, b) { return a + b; };
var injector = createInjector(testFn);
var extract = injector.extract(testFn);
casper.test.assertType(extract, "object", 'FunctionArgsInjector.extract() returns an object');
casper.test.assertEquals(extract.name, null, 'FunctionArgsInjector.extract() process function name as expected');
casper.test.assertEquals(extract.body, 'return a + b;', 'FunctionArgsInjector.extract() process function body as expected');
casper.test.assertEquals(extract.args, ['a', 'b'], 'FunctionArgsInjector.extract() process function args as expected');
var processed;
eval('processed = ' + injector.process({ a: 1, b: 2 }));
casper.test.assertEquals(processed(), 3, 'FunctionArgsInjector.process() proccessed the function correctly');

// Casper#log()
casper.test.comment('logging');
var oldLevel = casper.options.logLevel;
casper.options.logLevel = 'info';
casper.options.verbose = false;
casper.log('foo', 'info');
casper.test.assert(casper.result.log.some(function(e) {
    return e.message === 'foo' && e.level === 'info';
}), 'Casper.log() adds a log entry');
casper.options.logLevel = oldLevel;
casper.options.verbose = true;

// Casper#start()
casper.test.comment('navigating');
casper.start('tests/site/index.html', function(self) {
    self.test.assert(self.exists('a') && !self.exists('chucknorriz'), 'Casper.exists() can check if an element exists');
    self.test.assertTitle('CasperJS test index', 'Casper.start() casper can start itself an open an url');
    self.test.assertEval(function() {
        return typeof(__utils__) === "object";
    }, 'Casper.start() injects ClientUtils instance within remote DOM');
    self.test.comment('fetching');
    self.test.assertEquals(self.fetchText('ul li'), 'onetwothree', 'Casper.fetchText() can retrieves text contents');
    self.test.comment('encoding');
    var image = self.base64encode('file://' + phantom.libraryPath + '/site/images/phantom.png');
    self.test.assertEquals(image.length, 6160, 'Casper.base64encode() can retrieve base64 contents');
    self.test.comment('clicking');
    self.click('a[href="test.html"]');
});

casper.test.assertEquals(casper.steps.length, 2, 'Casper.start() can add a new navigation step');

// Casper.viewport()
casper.test.comment('viewport');
casper.viewport(1337, 999);
casper.test.assertEquals(casper.page.viewportSize.width, 1337, 'Casper.viewport() can change the width of page viewport');
casper.test.assertEquals(casper.page.viewportSize.height, 999, 'Casper.viewport() can change the height of page viewport');
casper.test.assertRaises(casper.viewport, ['a', 'b'], 'Casper.viewport() validates viewport size data');

// Casper#then()
casper.test.comment('then');
casper.then(function(self) {
    self.test.assertTitle('CasperJS test target', 'Casper.click() casper can click on a text link and react when it is loaded 1/2');
    self.click('a[href="form.html"]');
});

casper.test.assert(casper.steps.length === 3, 'Casper.then() adds a new navigation step');

// Casper#capture()
casper.test.comment('capturing');
casper.viewport(300, 200);
var testFile = '/tmp/__casper_test_capture.png';
if (fs.isFile(testFile)) {
    fs.remove(testFile);
}
casper.capture(testFile);
casper.test.assert(fs.isFile(testFile), 'Casper.capture() captured a screenshot');
fs.remove(testFile);

// Casper#evaluate()
casper.then(function(self) {
    self.test.comment('Casper.evaluate()');
    var params = {
        "boolean true":  true,
        "boolean false": false,
        "int number":    42,
        "float number":  1337.42,
        "string":        "plop! \"Ÿ£$\" 'no'",
        "array":         [1, 2, 3],
        "object":        {a: 1, b: 2}
    };
    var casperParams = self.evaluate(function() {
        return __casper_params__;
    }, params);
    self.test.assertType(casperParams, "object", 'Casper.evaluate() exposes parameters in a dedicated object');
    self.test.assertEquals(Object.keys(casperParams).length, 7, 'Casper.evaluate() object containing parameters has the correct length');
    for (var param in casperParams) {
        self.test.assertEquals(JSON.stringify(casperParams[param]), JSON.stringify(params[param]), 'Casper.evaluate() can pass a ' + param);
        self.test.assertEquals(typeof casperParams[param], typeof params[param], 'Casper.evaluate() preserves the ' + param + ' type');
    }
});

// Casper#fill()
casper.then(function(self) {
    self.test.assertTitle('CasperJS test form', 'Casper.click() casper can click on a text link and react when it is loaded 2/2');
    self.test.comment('filling a form');
    self.fill('form[action="result.html"]', {
        email:         'chuck@norris.com',
        content:       'Am watching thou',
        check:         true,
        choice:        'no',
        topic:         'bar',
        file:          phantom.libraryPath + '/README.md',
        'checklist[]': ['1', '3']
    });
    self.test.assertEvalEquals(function() {
        return document.querySelector('input[name="email"]').value;
    }, 'chuck@norris.com', 'Casper.fill() can fill an input[type=text] form field');
    self.test.assertEvalEquals(function() {
        return document.querySelector('textarea[name="content"]').value;
    }, 'Am watching thou', 'Casper.fill() can fill a textarea form field');
    self.test.assertEvalEquals(function() {
        return document.querySelector('select[name="topic"]').value;
    }, 'bar', 'Casper.fill() can pick a value from a select form field');
    self.test.assertEvalEquals(function() {
        return document.querySelector('input[name="check"]').checked;
    }, true, 'Casper.fill() can check a form checkbox');
    self.test.assertEvalEquals(function() {
        return document.querySelector('input[name="choice"][value="no"]').checked;
    }, true, 'Casper.fill() can check a form radio button 1/2');
    self.test.assertEvalEquals(function() {
        return document.querySelector('input[name="choice"][value="yes"]').checked;
    }, false, 'Casper.fill() can check a form radio button 2/2');
    self.test.assertEvalEquals(function() {
        return document.querySelector('input[name="file"]').files.length === 1;
    }, true, 'Casper.fill() can select a file to upload');
    self.test.assertEvalEquals(function() {
        return (document.querySelector('input[name="checklist[]"][value="1"]').checked &&
               !document.querySelector('input[name="checklist[]"][value="2"]').checked &&
                document.querySelector('input[name="checklist[]"][value="3"]').checked);
    }, true, 'Casper.fill() can fill a list of checkboxes');
    self.click('input[type="submit"]');
});

// Casper#click()
casper.then(function(self) {
    self.test.assertTitle('CasperJS test form result', 'Casper.click() casper can click on a submit button');
    self.test.assertUrlMatch(/email=chuck@norris.com/, 'Casper.fill() input[type=email] field was submitted');
    self.test.assertUrlMatch(/content=Am\+watching\+thou/, 'Casper.fill() textarea field was submitted');
    self.test.assertUrlMatch(/check=on/, 'Casper.fill() input[type=checkbox] field was submitted');
    self.test.assertUrlMatch(/choice=no/, 'Casper.fill() input[type=radio] field was submitted');
    self.test.assertUrlMatch(/topic=bar/, 'Casper.fill() select field was submitted');
});

// Casper#thenClick()
casper.thenClick('body a', function(self) {
    self.test.comment('Casper.thenClick()');
    self.test.assertTitle('CasperJS test index', 'Casper.thenClick() casper can add a step for clicking a link');
});

// Casper#each()
casper.test.comment('each');
casper.each([1, 2, 3], function(self, item, i) {
    self.test.assertEquals(i, item - 1, 'Casper.each() passes a contextualized index');
});

// Casper.XUnitExporter
casper.test.comment('phantom.Casper.XUnitExporter');
xunit = new phantom.Casper.XUnitExporter();
xunit.addSuccess('foo', 'bar');
casper.test.assertMatch(xunit.getXML(), /<testcase classname="foo" name="bar"/, 'XUnitExporter.addSuccess() adds a successful testcase');
xunit.addFailure('bar', 'baz', 'wrong', 'chucknorriz');
casper.test.assertMatch(xunit.getXML(), /<testcase classname="bar" name="baz"><failure type="chucknorriz">wrong/, 'XUnitExporter.addFailure() adds a failed testcase');

// Casper.ClientUtils.log()
casper.then(function(self) {
    casper.test.comment('client utils log');
    var oldLevel = casper.options.logLevel;
    casper.options.logLevel = 'debug';
    casper.options.verbose = false;
    casper.evaluate(function() {
        __utils__.log('debug message');
        __utils__.log('info message', 'info');
    });
    casper.test.assert(casper.result.log.some(function(e) {
        return e.message === 'debug message' && e.level === 'debug' && e.space === 'remote';
    }), 'ClientUtils.log() adds a log entry');
    casper.test.assert(casper.result.log.some(function(e) {
        return e.message === 'info message' && e.level === 'info' && e.space === 'remote';
    }), 'ClientUtils.log() adds a log entry at a given level');
    casper.options.logLevel = oldLevel;
    casper.options.verbose = true;
});

// Casper.wait()
var waitStart;
casper.then(function() {
    waitStart = new Date().getTime();
}).wait(1000, function(self) {
    self.test.comment('wait');
    self.test.assert(new Date().getTime() - waitStart > 1000, 'Casper.wait() can wait for a given amount of time');
    // Casper.waitFor()
    casper.thenOpen('tests/site/waitFor.html', function(self) {
        casper.test.comment('waitFor');
        self.waitFor(function(self) {
            return self.evaluate(function() {
                return document.querySelectorAll('li').length === 4;
            });
        }, function(self) {
            self.test.pass('Casper.waitFor() can wait for something to happen');
        }, function(self) {
            self.test.fail('Casper.waitFor() can wait for something to happen');
        });
    });
});

// Casper.getGlobal()
casper.thenOpen('tests/site/global.html', function(self) {
    self.test.comment('Casper.getGlobal()');
    self.test.assertEquals(self.getGlobal('myGlobal'), 'awesome string', 'Casper.getGlobal() can retrieve a remote global variable');
    self.test.assertRaises(self.getGlobal, ['myUnencodableGlobal'], 'Casper.getGlobal() does not fail trying to encode an unencodable global');
});

// Casper.options.onStepComplete
casper.then(function(self) {
    self.options.onStepComplete = function(self, stepResult) {
        self.test.comment('Casper.options.onStepComplete()');
        self.test.assertEquals(stepResult, 'ok', 'Casper.options.onStepComplete() is called on step complete');
        self.options.onStepComplete = null;
    };
    return 'ok';
});

// Casper.options.onResourceRequested & Casper.options.onResourceReceived
casper.then(function(self) {
    self.options.onResourceReceived = function(self, resource) {
        self.test.comment('Casper.options.onResourceReceived()');
        self.test.assertType(resource, 'object', 'Casper.options.onResourceReceived() retrieve a resource object');
        self.test.assert('status' in resource, 'Casper.options.onResourceReceived() retrieve a valid resource object');
        self.options.onResourceReceived = null;
    };
    self.options.onResourceRequested = function(self, request) {
        self.test.comment('Casper.options.onResourceRequested()');
        self.test.assertType(request, 'object', 'Casper.options.onResourceRequested() retrieve a request object');
        self.test.assert('method' in request, 'Casper.options.onResourceRequested() retrieve a valid request object');
        self.options.onResourceRequested = null;
    };
    self.thenOpen('tests/site/page1.html');
});

// Casper.visible()
casper.thenOpen('tests/site/visible.html', function(self) {
    self.test.comment('Casper.visible()');
    self.test.assert(self.visible('#img1'), 'Casper.visible() can detect if an element is visible');
    self.test.assert(!self.visible('#img2'), 'Casper.visible() can detect if an element is invisible');
    self.test.assert(!self.visible('#img3'), 'Casper.visible() can detect if an element is invisible');
    self.waitWhileVisible('#img1', function(self) {
        self.test.comment('Casper.waitWhileVisible()');
        self.test.pass('Casper.waitWhileVisible() can wait while an element is visible');
    }, function(self) {
        self.test.comment('Casper.waitWhileVisible()');
        self.test.fail('Casper.waitWhileVisible() can wait while an element is visible');
    }, 2000);
});

// History
casper
    .thenOpen('tests/site/page1.html')
    .thenOpen('tests/site/page2.html')
    .thenOpen('tests/site/page3.html')
    .back()
    .then(function(self) {
        self.test.comment('navigating history backward');
        self.test.assertMatch(self.getCurrentUrl(), /tests\/site\/page2\.html$/, 'Casper.back() can go back an history step');
    })
    .forward()
    .then(function(self) {
        self.test.comment('navigating history forward');
        self.test.assertMatch(self.getCurrentUrl(), /tests\/site\/page3\.html$/, 'Casper.forward() can go forward an history step');
    })
;

// Casper.options.onAlert()
casper.then(function(self) {
    self.options.onAlert = function(self, message) {
        self.test.assertEquals(message, 'plop', 'Casper.options.onAlert() can intercept an alert message');
    };
});
casper.thenOpen('tests/site/alert.html').click('button', function(self) {
    self.options.onAlert = null;
});

// run suite
casper.run(function(self) {
    casper.test.comment('history');
    casper.test.assert(self.history.length > 0, 'Casper.history contains urls');
    casper.test.assertMatch(self.history[0], /tests\/site\/index\.html$/, 'Casper.history has the correct first url');
    self.test.comment('logging, again');
    self.test.assertEquals(self.result.log.length, 3, 'Casper.log() logged messages');
    self.test.renderResults(true, 0, save);
});
