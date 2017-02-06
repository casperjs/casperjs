/*eslint strict:0*/
var fs = require('fs');
var selectXPath = require('casper').selectXPath;
var exp = false;

/**
 * Known regression in 2.0.0, will be fixed in 2.0.1
 * https://github.com/ariya/phantomjs/issues/12506
 */
function skipPhantom200 (test, nb) {
    return test.skipIfEngine(nb, {
        name: 'phantomjs',
        version: {
            min: '2.0.0',
            max: '2.0.0'
        },
        message: 'form regression 12506'
    });
}

function skipSlimer095 (test, nb) {
    return test.skipIfEngine(nb, {
        name: 'slimerjs',
        version: {
            min: '0.8.0',
            max: '0.9.4'
        },
        message: 'filePicker method missing'
    });
}

function testFormValues(test) {
    test.assertField('email', 'chuck@norris.com',
        'can fill an input[type=text] form field');
    test.assertField('password', '42',
        'can fill an input[type=password] form field');
    test.assertField('content', 'Am watching thou',
        'can fill a textarea form field');
    test.assertField('topic', 'bar',
        'can pick a value from a select form field');
    test.assertField('multitopic', ['bar', 'car'],
        'can pick a set of values from a multiselect form field');
    test.assertField('check', true,
        'can check a form checkbox');
    test.assertEvalEquals(function() {
        return __utils__.findOne('input[name="choice"][value="no"]').checked;
    }, true, 'can check a form radio button 1/2');
    test.assertEvalEquals(function() {
        return __utils__.findOne('input[name="choice"][value="yes"]').checked;
    }, false, 'can check a form radio button 2/2');
    test.assertEvalEquals(function() {
        return (__utils__.findOne('input[name="checklist[]"][value="1"]').checked &&
               !__utils__.findOne('input[name="checklist[]"][value="2"]').checked &&
                __utils__.findOne('input[name="checklist[]"][value="3"]').checked);
    }, true, 'can fill a list of checkboxes');
    if (!skipPhantom200(test, 2)) {
        test.assertEvalEquals(function() {
            return __utils__.findOne('input[name="file"]').files.length === 1;
        }, true, 'can select a file to upload');
        if (!skipSlimer095(test,1)) {
            test.assertEvalEquals(function() {
               return __utils__.findOne('input[name="file"]').value.indexOf('README.md') !== -1;
            }, true, 'can check a form file value');
        }
    }
}

function testUrl(test) {
    casper.waitForUrl(/(^\?|&)submit=submit($|&)/, function() {
        test.assertUrlMatch(/email=chuck@norris.com/, 'input[type=email] field was submitted');
        test.assertUrlMatch(/password=42/, 'input[type=password] field was submitted');
        test.assertUrlMatch(/content=Am\+watching\+thou/, 'textarea field was submitted');
        test.assertUrlMatch(/check=on/, 'input[type=checkbox] field was submitted');
        test.assertUrlMatch(/choice=no/, 'input[type=radio] field was submitted');
        test.assertUrlMatch(/topic=bar/, 'select field was submitted');
        test.assertUrlMatch(/multitopic=bar&multitopic=car/, 'multitopic select fields were submitted');
        test.assertUrlMatch(/strange=very/, 'strangely typed input field was submitted');
    });
}



casper.test.begin('fill() & fillNames() tests', 19, function(test) {
    var fpath = fs.pathJoin(phantom.casperPath, 'README.md');

    casper.start('tests/site/form.html', function() {
        this.fill('form[action="result.html"]', {
            email:         'chuck@norris.com',
            password:      42,
            content:       'Am watching thou',
            check:         true,
            choice:        'no',
            topic:         'bar',
            multitopic:    ['bar', 'car'],
            file:          fpath,
            'checklist[]': ['1', '3'],
            strange:       "very"
        });
        testFormValues(test);
    });
    casper.thenClick('input[type="submit"]', function() {
        testUrl(test);
    });
    casper.run(function() {
        test.done();
    });
});

casper.test.begin('fillLabels() tests', 19, function(test) {
    var fpath = fs.pathJoin(phantom.casperPath, 'README.md');

    casper.start('tests/site/form.html', function() {
        this.fillLabels('form[action="result.html"]', {
            Email:         'chuck@norris.com',
            Password:      42,
            Content:       'Am watching thou',
            Check:         true,
            No:            true,
            Topic:         'bar',
            Multitopic:    ['bar', 'car'],
            File:          fpath,
            "1":           true,
            "3":           true,
            Strange:       "very"
        });
        testFormValues(test);
    });
    casper.thenClick('input[type="submit"]', function() {
        testUrl(test);
    });
    casper.run(function() {
        test.done();
    });
});

casper.test.begin('fillSelectors() tests', 19, function(test) {
    var fpath = fs.pathJoin(phantom.casperPath, 'README.md');

    casper.start('tests/site/form.html', function() {
        this.fillSelectors('form[action="result.html"]', {
            "input[name='email']":        'chuck@norris.com',
            "input[name='password']":     42,
            "textarea[name='content']":   'Am watching thou',
            "input[name='check']":        true,
            "input[name='choice']":       'no',
            "select[name='topic']":       'bar',
            "select[name='multitopic']":  ['bar', 'car'],
            "input[name='file']":         fpath,
            "input[name='checklist[]']":  ['1', '3'],
            "input[name='strange']":      "very"
        });
        testFormValues(test);
    });
    casper.thenClick('input[type="submit"]', function() {
        testUrl(test);
    });
    casper.run(function() {
        test.done();
    });
});

casper.test.begin('fillXPath() tests', 19, {

    setUp: function(test) {
        var self = this;
        var fpath = fs.pathJoin(phantom.casperPath, 'README.md');
        casper.removeAllFilters('page.filePicker');
        casper.setFilter('page.filePicker', function() {
            exp = true;
            return fpath;
        });
    },

    tearDown: function(test) {
        casper.removeAllFilters('page.filePicker');
    },

    test: function(test) {
        var fpath = fs.pathJoin(phantom.casperPath, 'README.md');
        casper.start('tests/site/form.html', function() {
            this.fillXPath('form[action="result.html"]', {
                '//input[@name="email"]':       'chuck@norris.com',
                '//input[@name="password"]':    42,
                '//textarea[@name="content"]':  'Am watching thou',
                '//input[@name="check"]':       true,
                '//input[@name="choice"]':      'no',
                '//select[@name="topic"]':      'bar',
                '//input[@name="file"]':         fpath,
                '//select[@name="multitopic"]': ['bar', 'car'],
                '//input[@name="checklist[]"]': ['1', '3'],
                '//input[@name="strange"]':     "very"
            });
        });
        casper.thenClick(selectXPath('//input[@name="file"]'), function() {
            testFormValues(test);
        });
        casper.thenClick('input[type="submit"]', function() {
            testUrl(test);
        });
        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin('nonexistent fields', 1, function(test) {
    casper.start('tests/site/form.html', function() {
        test.assertRaises(this.fill, ['form[action="result.html"]', {
            nonexistent: 42
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
    }).waitForUrl(/\?f=f2&yo=ok$/, function() {
        this.fill('form[name="f2"]', {
            yo: "ok"
        });
        test.assertEquals(this.getFormValues('form[name="f2"]'), {
            f: "f2",
            yo: "ok"
        }, 'Casper.getFormValues() retrieves filled values when multiple forms have same field names');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('file multiple', 1, function(test) {
    var fpaths = [fs.pathJoin(phantom.casperPath, 'README.md'),
                  fs.pathJoin(phantom.casperPath, 'LICENSE.md')
                 ];

    casper.start('tests/site/field-file-multiple.html', function() {
        this.fillSelectors('form[action="result.html"]', {
            'input[name="files[]"]': fpaths
        });
        if (!skipPhantom200(test, 1)) {
            test.assertEval(function() {
                return __utils__.findOne('input[type="file"]').files.length === 2;
            });
        }
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
    }).waitForUrl("?foo[bar]=bar&foo[baz]=baz", function() {
        test.pass('Casper.fill() handles array syntax field names');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('getFormValues() tests', 2, function(test) {
    var fpath = fs.pathJoin(phantom.casperPath, 'README.md');
    var fileValue = 'README.md';
    if (phantom.casperEngine === 'phantomjs') {
        if (utils.matchEngine({
            name: 'phantomjs',
            version: {min: '2.0.0', max: '2.0.0'}
        })) {
            fileValue = '';
        } else {
            fileValue = 'C:\\fakepath\\README.md'; // phantomjs/webkit sets that;
        }
    }

    casper.start('tests/site/form.html', function() {
        this.fill('form[action="result.html"]', {
            email:         'chuck@norris.com',
            password:      42,
            language:      'english',
            content:       'Am watching thou',
            check:         true,
            choice:        'no',
            topic:         'bar',
            multitopic:    ['bar', 'car'],
            file:          fpath,
            'checklist[]': ['1', '3'],
            strange:       "very"
        });
    });
    casper.then(function() {
        test.assertEquals(this.getFormValues('form'), {
            "check": true,
            "checklist[]": ["1", "3"],
            "choice": "no",
            "content": "Am watching thou",
            "email": "chuck@norris.com",
            "file": fileValue,
            "password": "42",
            "submit": "submit",
            "language": "english",
            "topic": "bar",
            "multitopic": ["bar", "car"],
            "strange": "very"
        }, 'Casper.getFormValues() retrieves filled values');
    });
    casper.then(function() {
        this.fill('form[action="result.html"]', {
            email:         'chuck@norris.com',
            password:      '42',
            language:      'english',
            content:       'Am watching thou',
            check:         true,
            choice:        'yes',
            topic:         'bar',
            multitopic:    ["bar", "car"],
            file:          fpath,
            'checklist[]': ['1', '3'],
            strange:       "very"
        });
    });
    casper.then(function() {
        test.assertEquals(this.getFormValues('form'), {
            "check": true,
            "checklist[]": ["1", "3"],
            "choice": "yes",
            "content": "Am watching thou",
            "email": "chuck@norris.com",
            "file": fileValue,
            "password": "42",
            "language": "english",
            "submit": "submit",
            "topic": "bar",
            "multitopic": ["bar", "car"],
            "strange": "very"
        }, 'Casper.getFormValues() correctly retrieves values from radio inputs regardless of order');
    });
    casper.run(function() {
        test.done();
    });
});

casper.test.begin('fillSelectors() tests', 4, function(test) {
    var fpath = fs.pathJoin(phantom.casperPath, 'README.md');

    casper.start('tests/site/form.html', function() {
        this.fillSelectors('form[action="result.html"]', {
            "select[name='topic']":       'baz',
            "select[name='multitopic']":  ['baz', 'caz'],
        });
        test.assertField('topic', 'bar', 'can pick a value from a select form field by text value');
        test.assertField('multitopic', ['bar', 'car'], 'can pick a set of values from a multiselect form field by text value');
    });
    casper.thenClick('input[type="submit"]', function() {
        test.assertUrlMatch(/topic=bar/, 'select field was submitted');
        test.assertUrlMatch(/multitopic=bar&multitopic=car/, 'multitopic select fields were submitted');
    });
    casper.run(function() {
        test.done();
    });
});

//
// setFieldValue() tests
//
casper.test.begin('setFieldValue() tests with css3 selector and form', 11, function(test) {
    var fpath = fs.pathJoin(phantom.casperPath, 'README.md');
    casper.start('tests/site/form.html', function() {
        var data = {
            "input[name='email']":        'chuck@norris.com',
            "input[name='password']":     42,
            "textarea[name='content']":   'Am watching thou',
            "input[name='check']":        true,
            "input[name='choice']":       'no',
            "select[name='topic']":       'bar',
            "input[name='file']":         fpath,
            "select[name='multitopic']":  ['bar', 'car'],
            "input[name='checklist[]']":  ['1', '3'],
            "input[name='strange']":      "very"
        };

        for (var selector in data){
            this.setFieldValue(selector, data[selector], 'form[action="result.html"]');
        }
        testFormValues(test);
    });

    casper.run(function() {
        test.done();    
    });
});

casper.test.begin('setFieldValue() tests with XPath selector', 11, function(test) {
    var fpath = fs.pathJoin(phantom.casperPath, 'README.md');
    casper.start('tests/site/form.html', function() {
        var data = {
            '//input[@name="email"]':       'chuck@norris.com',
            '//input[@name="password"]':    42,
            '//textarea[@name="content"]':  'Am watching thou',
            '//input[@name="check"]':       true,
            '//input[@name="choice"]':      'no',
            '//select[@name="topic"]':      'bar',
            '//input[@name="file"]':         fpath,
            '//select[@name="multitopic"]': ['bar', 'car'],
            '//input[@name="checklist[]"]': ['1', '3'],
            '//input[@name="strange"]':     "very"
        };

        for (var selector in data){
            this.setFieldValue( selectXPath(selector), data[selector]);
        }
        testFormValues(test);
    });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('setFieldValueName() tests', 11, function(test) {
    var fpath = fs.pathJoin(phantom.casperPath, 'README.md');
    casper.start('tests/site/form.html', function() {
        var data = {
            email:         'chuck@norris.com',
            password:      42,
            content:       'Am watching thou',
            check:         true,
            choice:        'no',
            topic:         'bar',
            file:          fpath,
            multitopic:    ['bar', 'car'],
            'checklist[]': ['1', '3'],
            strange:       "very"
        };

        for (var selector in data){
            this.setFieldValueName(selector, data[selector]);
        }
        testFormValues(test);
    });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('setFieldValueLabel() tests', 11, function(test) {
    var fpath = fs.pathJoin(phantom.casperPath, 'README.md');
    casper.start('tests/site/form.html', function() {0
        var data = {
            Email:         'chuck@norris.com',
            Password:      42,
            Content:       'Am watching thou',
            Check:         true,
            No:            true,
            Topic:         'bar',
            File:          fpath,
            Multitopic:    ['bar', 'car'],
            "1":           true,
            "3":           true,
            Strange:       "very"     
        };
        for (var selector in data){
            this.setFieldValueLabel(selector, data[selector]);
        }
        testFormValues(test);
    });

    casper.run(function() {
        test.done();
        casper.result.log = [];
    });
});

// end setFieldValue() test
