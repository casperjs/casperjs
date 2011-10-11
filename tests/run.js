phantom.injectJs('casper.js');
phantom.injectJs('tests/assert.js');

var casper = new phantom.Casper({
    faultTolerant: false,
    verbose: true,
});

phantom.args.forEach(function(arg) {
    var debugMatch = /--loglevel=(\w+)/.exec(arg);
    if (debugMatch) {
        casper.options.logLevel = debugMatch[1];
    }
});

// Casper#log()
var oldLevel = casper.options.logLevel;
casper.options.logLevel = 'info';
casper.options.verbose = false;
casper.log('foo', 'info');
casper.assert(casper.result.log.some(function(e) {
    return e.message === 'foo' && e.level === 'info';
}), 'log() adds a log entry');
casper.options.logLevel = oldLevel;
casper.options.verbose = true;

// Casper#start()
casper.start('tests/site/index.html', function(self) {
    self.assertTitle('CasperJS test index', 'start() casper can start itself an open an url');
    self.assertEval(function() {
        return typeof(__utils__) === "object";
    }, 'start() injects ClientUtils instance within remote DOM');
    var image = self.base64encode('file://' + phantom.libraryPath + '/site/images/phantom.png');
    self.assertEquals(image.length, 6160, 'base64encode() can retrieve base64 contents');
    self.click('a[href="test.html"]');
});

casper.assert(casper.steps.length === 1, 'start() can add a new navigation step');

// Casper#then()
casper.then(function(self) {
    self.assertTitle('CasperJS test target', 'click() casper can click on a text link and react when it is loaded 1/2');
    self.click('a[href="form.html"]');
});

casper.assert(casper.steps.length === 2, 'then() adds a new navigation step');

// Casper#fill()
casper.then(function(self) {
    self.assertTitle('CasperJS test form', 'click() casper can click on a text link and react when it is loaded 2/2');
    self.fill('form[action="result.html"]', {
        email:   'chuck@norris.com',
        content: 'Am watching thou',
        check:   true,
        choice:  'no',
        topic:   'bar',
        file:    phantom.libraryPath + '/README.md'
    });
    self.assertEvalEquals(function() {
        return document.querySelector('input[name="email"]').value;
    }, 'chuck@norris.com', 'fill() can fill an input[type=text] form field');
    self.assertEvalEquals(function() {
        return document.querySelector('textarea[name="content"]').value;
    }, 'Am watching thou', 'fill() can fill a textarea form field');
    self.assertEvalEquals(function() {
        return document.querySelector('select[name="topic"]').value;
    }, 'bar', 'fill() can pick a value from a select form field');
    self.assertEvalEquals(function() {
        return document.querySelector('input[name="check"]').checked;
    }, true, 'fill() can check a form checkbox');
    self.assertEvalEquals(function() {
        return document.querySelector('input[name="choice"][value="no"]').checked;
    }, true, 'fill() can check a form radio button 1/2');
    self.assertEvalEquals(function() {
        return document.querySelector('input[name="choice"][value="yes"]').checked;
    }, false, 'fill() can check a form radio button 2/2');
    self.assertEvalEquals(function() {
        return document.querySelector('input[name="file"]').files.length === 1;
    }, true, 'fill() can select a file to upload');
    self.click('input[type="submit"]');
});

// Casper#click()
casper.then(function(self) {
    self.assertTitle('CasperJS test form result', 'click() casper can click on a submit button');
    self.assertUrlMatch(/email=chuck@norris.com/, 'fill() input[type=email] field was submitted');
    self.assertUrlMatch(/content=Am\+watching\+thou/, 'fill() textarea field was submitted');
    self.assertUrlMatch(/check=on/, 'fill() input[type=checkbox] field was submitted');
    self.assertUrlMatch(/choice=no/, 'fill() input[type=radio] field was submitted');
    self.assertUrlMatch(/topic=bar/, 'fill() select field was submitted');
});

casper.run(function(self) {
    self.assert(self.result.log.length > 0, 'log() logged messages');
    self.renderResults();
});
