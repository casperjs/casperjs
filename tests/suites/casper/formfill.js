(function(t) {
    casper.start('tests/site/form.html', function(self) {
        t.comment('Casper.fill()');
        self.fill('form[action="result.html"]', {
            email:         'chuck@norris.com',
            content:       'Am watching thou',
            check:         true,
            choice:        'no',
            topic:         'bar',
            file:          phantom.libraryPath + '/README.md',
            'checklist[]': ['1', '3']
        });
        t.assertEvalEquals(function() {
            return document.querySelector('input[name="email"]').value;
        }, 'chuck@norris.com', 'Casper.fill() can fill an input[type=text] form field');
        t.assertEvalEquals(function() {
            return document.querySelector('textarea[name="content"]').value;
        }, 'Am watching thou', 'Casper.fill() can fill a textarea form field');
        t.assertEvalEquals(function() {
            return document.querySelector('select[name="topic"]').value;
        }, 'bar', 'Casper.fill() can pick a value from a select form field');
        t.assertEvalEquals(function() {
            return document.querySelector('input[name="check"]').checked;
        }, true, 'Casper.fill() can check a form checkbox');
        t.assertEvalEquals(function() {
            return document.querySelector('input[name="choice"][value="no"]').checked;
        }, true, 'Casper.fill() can check a form radio button 1/2');
        t.assertEvalEquals(function() {
            return document.querySelector('input[name="choice"][value="yes"]').checked;
        }, false, 'Casper.fill() can check a form radio button 2/2');
        t.assertEvalEquals(function() {
            return document.querySelector('input[name="file"]').files.length === 1;
        }, true, 'Casper.fill() can select a file to upload');
        t.assertEvalEquals(function() {
            return (document.querySelector('input[name="checklist[]"][value="1"]').checked &&
                   !document.querySelector('input[name="checklist[]"][value="2"]').checked &&
                    document.querySelector('input[name="checklist[]"][value="3"]').checked);
        }, true, 'Casper.fill() can fill a list of checkboxes');
        self.click('input[type="submit"]');
    });

    casper.then(function(self) {
        t.comment('Form submitted');
        t.assertUrlMatch(/email=chuck@norris.com/, 'Casper.fill() input[type=email] field was submitted');
        t.assertUrlMatch(/content=Am\+watching\+thou/, 'Casper.fill() textarea field was submitted');
        t.assertUrlMatch(/check=on/, 'Casper.fill() input[type=checkbox] field was submitted');
        t.assertUrlMatch(/choice=no/, 'Casper.fill() input[type=radio] field was submitted');
        t.assertUrlMatch(/topic=bar/, 'Casper.fill() select field was submitted');
    });

    casper.run(function(self) {
        t.done();
    });
})(casper.test);
