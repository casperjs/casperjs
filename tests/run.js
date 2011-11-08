phantom.injectJs('casper.js');

var casper = new phantom.Casper({
    faultTolerant: false,
    verbose: true
});

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

// Casper#log()
casper.test.comment('logging');
var oldLevel = casper.options.logLevel;
casper.options.logLevel = 'info';
casper.options.verbose = false;
casper.log('foo', 'info');
casper.test.assert(casper.result.log.some(function(e) {
    return e.message === 'foo' && e.level === 'info';
}), 'log() adds a log entry');
casper.options.logLevel = oldLevel;
casper.options.verbose = true;

// Casper#start()
casper.test.comment('navigating');
casper.start('tests/site/index.html', function(self) {
    self.test.assert(self.exists('a') && !self.exists('chucknorriz'), 'exists() can check if an element exists');
    self.test.assertTitle('CasperJS test index', 'start() casper can start itself an open an url');
    self.test.assertEval(function() {
        return typeof(__utils__) === "object";
    }, 'start() injects ClientUtils instance within remote DOM');
    self.test.comment('fetching');
    self.test.assertEquals(self.fetchText('ul li'), 'onetwothree', 'fetchText() can retrieves text contents');
    self.test.comment('encoding');
    var image = self.base64encode('file://' + phantom.libraryPath + '/site/images/phantom.png');
    self.test.assertEquals(image.length, 6160, 'base64encode() can retrieve base64 contents');
    self.test.comment('clicking');
    self.click('a[href="test.html"]');
});

casper.test.assert(casper.steps.length === 1, 'start() can add a new navigation step');

// Casper#then()
casper.then(function(self) {
    self.test.assertTitle('CasperJS test target', 'click() casper can click on a text link and react when it is loaded 1/2');
    self.click('a[href="form.html"]');
});

casper.test.assert(casper.steps.length === 2, 'then() adds a new navigation step');

// Casper#evaluate()

casper.then(function(self) {
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
    self.test.assertEquals(Object.keys(casperParams).length, 7, 'Casper.evaluate() exposes parameters object has the correct length');
    for (var param in casperParams) {
        self.test.assertEquals(JSON.stringify(casperParams[param]), JSON.stringify(params[param]), 'Casper.evaluate() can pass a ' + param);
    }
});

// Casper#fill()
casper.then(function(self) {
    self.test.assertTitle('CasperJS test form', 'click() casper can click on a text link and react when it is loaded 2/2');
    self.test.comment('filling a form');
    self.fill('form[action="result.html"]', {
        email:   'chuck@norris.com',
        content: 'Am watching thou',
        check:   true,
        choice:  'no',
        topic:   'bar',
        file:    phantom.libraryPath + '/README.md'
    });
    self.test.assertEvalEquals(function() {
        return document.querySelector('input[name="email"]').value;
    }, 'chuck@norris.com', 'fill() can fill an input[type=text] form field');
    self.test.assertEvalEquals(function() {
        return document.querySelector('textarea[name="content"]').value;
    }, 'Am watching thou', 'fill() can fill a textarea form field');
    self.test.assertEvalEquals(function() {
        return document.querySelector('select[name="topic"]').value;
    }, 'bar', 'fill() can pick a value from a select form field');
    self.test.assertEvalEquals(function() {
        return document.querySelector('input[name="check"]').checked;
    }, true, 'fill() can check a form checkbox');
    self.test.assertEvalEquals(function() {
        return document.querySelector('input[name="choice"][value="no"]').checked;
    }, true, 'fill() can check a form radio button 1/2');
    self.test.assertEvalEquals(function() {
        return document.querySelector('input[name="choice"][value="yes"]').checked;
    }, false, 'fill() can check a form radio button 2/2');
    self.test.assertEvalEquals(function() {
        return document.querySelector('input[name="file"]').files.length === 1;
    }, true, 'fill() can select a file to upload');
    self.click('input[type="submit"]');
});

// Casper#click()
casper.then(function(self) {
    self.test.assertTitle('CasperJS test form result', 'click() casper can click on a submit button');
    self.test.assertUrlMatch(/email=chuck@norris.com/, 'fill() input[type=email] field was submitted');
    self.test.assertUrlMatch(/content=Am\+watching\+thou/, 'fill() textarea field was submitted');
    self.test.assertUrlMatch(/check=on/, 'fill() input[type=checkbox] field was submitted');
    self.test.assertUrlMatch(/choice=no/, 'fill() input[type=radio] field was submitted');
    self.test.assertUrlMatch(/topic=bar/, 'fill() select field was submitted');
});

// Casper#each()
casper.each([1, 2, 3], function(self, item, i) {
    self.test.assertEquals(i, item - 1, 'each() passes a contextualized index');
});

// Casper.XUnitExporter
casper.test.comment('phantom.Casper.XUnitExporter');
xunit = new phantom.Casper.XUnitExporter();
xunit.addSuccess('foo', 'bar');
casper.test.assertMatch(xunit.getXML(), /<testcase classname="foo" name="bar"/, 'addSuccess() adds a successful testcase');
xunit.addFailure('bar', 'baz', 'wrong', 'chucknorriz');
casper.test.assertMatch(xunit.getXML(), /<testcase classname="bar" name="baz"><failure type="chucknorriz">wrong/, 'addFailure() adds a failed testcase');

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
var start = new Date().getTime();
casper.wait(1000, function(self) {
    self.test.comment('wait');
    self.test.assert(new Date().getTime() - start > 1000, 'Casper.wait() can wait for a given amount of time');

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

// run suite
casper.run(function(self) {
    self.test.comment('logging, again');
    self.test.assertEquals(self.result.log.length, 3, 'log() logged messages');
    self.test.renderResults(true, 0, save);
});
