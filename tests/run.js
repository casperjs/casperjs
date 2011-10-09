phantom.injectJs('casper.js');
phantom.injectJs('tests/assert.js');

var casper = new phantom.Casper({
    verbose: true,
}), testResults = {
    passed: 0,
    failed: 0
};

casper.start('tests/site/index.html', function(self) {
    self.assertEvalEquals(function() {
        return document.title;
    }, 'CasperJS test index', 'start() casper can start itself an open an url');
    self.click('a:first-child');
});

casper.then(function(self) {
    self.assertEvalEquals(function() {
        return document.title;
    }, 'CasperJS test target', 'click() casper can click on a text link and react when it is loaded');
    self.click('a:first-child');
});

casper.then(function(self) {
    self.fill('form[action="form.html"]', {
        'email':   'chuck@norris.com',
        'content': 'Am watching thou',
        'check':   true,
        'choice':  'no'
    });
    self.assertEvalEquals(function() {
        return document.querySelector('input[name="email"]').value;
    }, 'chuck@norris.com', 'fill() can fill an input[type=text] form field');
    self.assertEvalEquals(function() {
        return document.querySelector('textarea[name="content"]').value;
    }, 'Am watching thou', 'fill() can fill a textarea form field');
    self.assertEvalEquals(function() {
        return document.querySelector('input[name="check"]').checked;
    }, true, 'fill() can check a form checkbox');
    self.assertEvalEquals(function() {
        return document.querySelector('input[name="choice"][value="no"]').checked;
    }, true, 'fill() can check a form radio button');
});

casper.run(function(self) {
    self.echo("==========================================");
    var total = testResults.passed + testResults.failed;
    self.echo(total + ' tests executed, ' + testResults.passed + ' passed, ' + testResults.failed + ' failed.');
    self.exit();
});
