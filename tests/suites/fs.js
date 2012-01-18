var fs = require('fs'), t = casper.test;

// Testing added methods
(function() {
    t.comment('fs.dirname()');
    var tests = {
        '/local/plop/foo.js':      '/local/plop',
        'local/plop/foo.js':       'local/plop',
        './local/plop/foo.js':     './local/plop',
        'c:\\local\\plop\\foo.js': 'c:/local/plop',
        'D:\\local\\plop\\foo.js': 'D:/local/plop',
        'D:\\local\\plop\\':       'D:/local/plop',
        'c:\\':                    'c:',
        'c:':                      'c:'
    };
    for (var testCase in tests) {
        t.assertEquals(fs.dirname(testCase), tests[testCase], 'fs.dirname() does its job for ' + testCase);
    }
})();

t.done();