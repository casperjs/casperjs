(function(t) {
    t.comment('fileExt()');

    (function() {
        var testCases = {
            'foo.ext':    'ext',
            'FOO.EXT':    'ext',
            'a.ext':      'ext',
            '.ext':       'ext',
            'toto.':      '',
            ' plop.ext ': 'ext'
        };

        for (var testCase in testCases) {
            t.assertEquals(fileExt(testCase), testCases[testCase], 'fileExt() extract file extension');
        }
    })();

    t.comment('fillBlanks()');

    (function() {
        testCases = {
            'foo':         'foo       ',
            '  foo bar ':  '  foo bar ',
            '  foo bar  ': '  foo bar  '
        };

        for (var testCase in testCases) {
            t.assertEquals(fillBlanks(testCase, 10), testCases[testCase], 'fillBlanks() fills blanks');
        }
    })();

    t.comment('mergeObjects()');

    (function() {
        testCases = [
            {
                obj1: {a: 1}, obj2: {b: 2}, merged: {a: 1, b: 2}
            },
            {
                obj1: {}, obj2: {a: 1}, merged: {a: 1}
            },
            {
                obj1: {a: 1}, obj2: {}, merged: {a: 1}
            },
            {
                obj1: {a: 1}, obj2: {a: 2}, merged: {a: 2}
            },
            {
                obj1:   {x: 0, double: function(){return this.x*2;}},
                obj2:   {triple: function(){return this.x*3;}},
                merged: {
                    x: 0,
                    double: function(){return this.x*2;},
                    triple: function(){return this.x*3;}
                }
            }
        ];

        testCases.forEach(function(testCase) {
            t.assertEquals(mergeObjects(testCase.obj1, testCase.obj2), testCase.merged, 'mergeObjects() can merge objects');
        });
    })();

    t.done();
})(casper.test);
