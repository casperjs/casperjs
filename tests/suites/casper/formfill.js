/*global casper __utils__*/
/*jshint strict:false*/
casper.test.begin('fill() tests', 15, function(test) {
    casper.start('tests/site/form.html', function() {
        this.fill('form[action="result.html"]', {
            email:         'chuck@norris.com',
            password:      'chuck',
            content:       'Am watching thou',
            check:         true,
            choice:        'no',
            topic:         'bar',
            file:          phantom.libraryPath + '/README.md',
            'checklist[]': ['1', '3']
        });
        test.assertEvalEquals(function() {
            return __utils__.findOne('input[name="email"]').value;
        }, 'chuck@norris.com', 'Casper.fill() can fill an input[type=text] form field');
        test.assertEvalEquals(function() {
            return __utils__.findOne('input[name="password"]').value;
        }, 'chuck', 'Casper.fill() can fill an input[type=password] form field');
        test.assertEvalEquals(function() {
            return __utils__.findOne('textarea[name="content"]').value;
        }, 'Am watching thou', 'Casper.fill() can fill a textarea form field');
        test.assertEvalEquals(function() {
            return __utils__.findOne('select[name="topic"]').value;
        }, 'bar', 'Casper.fill() can pick a value from a select form field');
        test.assertEvalEquals(function() {
            return __utils__.findOne('input[name="check"]').checked;
        }, true, 'Casper.fill() can check a form checkbox');
        test.assertEvalEquals(function() {
            return __utils__.findOne('input[name="choice"][value="no"]').checked;
        }, true, 'Casper.fill() can check a form radio button 1/2');
        test.assertEvalEquals(function() {
            return __utils__.findOne('input[name="choice"][value="yes"]').checked;
        }, false, 'Casper.fill() can check a form radio button 2/2');
        test.assertEvalEquals(function() {
            return __utils__.findOne('input[name="file"]').files.length === 1;
        }, true, 'Casper.fill() can select a file to upload');
        test.assertEvalEquals(function() {
            return (__utils__.findOne('input[name="checklist[]"][value="1"]').checked &&
                   !__utils__.findOne('input[name="checklist[]"][value="2"]').checked &&
                    __utils__.findOne('input[name="checklist[]"][value="3"]').checked);
        }, true, 'Casper.fill() can fill a list of checkboxes');
    });
    casper.thenClick('input[type="submit"]', function() {
        test.assertUrlMatch(/email=chuck@norris.com/, 'Casper.fill() input[type=email] field was submitted');
        test.assertUrlMatch(/password=chuck/, 'Casper.fill() input[type=password] field was submitted');
        test.assertUrlMatch(/content=Am\+watching\+thou/, 'Casper.fill() textarea field was submitted');
        test.assertUrlMatch(/check=on/, 'Casper.fill() input[type=checkbox] field was submitted');
        test.assertUrlMatch(/choice=no/, 'Casper.fill() input[type=radio] field was submitted');
        test.assertUrlMatch(/topic=bar/, 'Casper.fill() select field was submitted');
    });
    casper.run(function() {
        test.done();
    });
});

casper.test.begin('unexistent fields', 1, function(test) {
    casper.start('tests/site/form.html', function() {
        test.assertRaises(this.fill, ['form[action="result.html"]', {
            unexistent: 42
        }, true], 'Casper.fill() raises an exception when unable to fill a form');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('multiple forms', 1, function(test) {
    casper.start('tests/site/multiple-forms.html', function() {
        this.fill('form[name="f2"]', {
            yo: "ok"
        }, true);
    }).then(function() {
        test.assertUrlMatch(/\?f=f2&yo=ok$/, 'Casper.fill() handles multiple forms');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('field array', 1, function(test) {
    // issue #267: array syntax field names
    casper.start('tests/site/field-array.html', function() {
        this.fill('form', {
            'foo[bar]': "bar",
            'foo[baz]': "baz"
        }, true);
    }).then(function() {
        test.assertUrlMatch('?foo[bar]=bar&foo[baz]=baz',
            'Casper.fill() handles array syntax field names');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('getFormValues() tests', 1, function(test) {
    casper.start('tests/site/form.html', function() {
        this.fill('form[action="result.html"]', {
            email:         'chuck@norris.com',
            password:      'chuck',
            content:       'Am watching thou',
            check:         true,
            choice:        'no',
            topic:         'bar',
            file:          phantom.libraryPath + '/README.md',
            'checklist[]': ['1', '3']
        });
    });
    casper.then(function() {
        test.assertEquals(this.getFormValues('form'), {
            "check": true,
            "checklist[]": ["1", "3"],
            "choice": "no",
            "content": "Am watching thou",
            "email": "chuck@norris.com",
            "file": "C:\\fakepath\\README.md",
            "password": "chuck",
            "submit": "submit",
            "topic": "bar"
        }, 'Casper.getFormValues() retrieves filled values');
    });
    casper.run(function() {
        test.done();
    });
});
