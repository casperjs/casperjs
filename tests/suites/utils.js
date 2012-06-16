var utils = require('utils'), t = casper.test;

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
        t.assertEquals(utils.fileExt(testCase), testCases[testCase], 'fileExt() extract file extension');
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
        t.assertEquals(utils.fillBlanks(testCase, 10), testCases[testCase], 'fillBlanks() fills blanks');
    }
})();

t.comment('getPropertyPath()');
(function() {
    testCases = [
        {
            input:  utils.getPropertyPath({}, 'a.b.c'),
            output: undefined
        },
        {
            input:  utils.getPropertyPath([1, 2, 3], 'a.b.c'),
            output: undefined
        },
        {
            input:  utils.getPropertyPath({ a: { b: { c: 1 } }, c: 2 }, 'a.b.c'),
            output: 1
        },
        {
            input:  utils.getPropertyPath({ a: { b: { c: 1 } }, c: 2 }, 'a.b.x'),
            output: undefined
        },
        {
            input:  utils.getPropertyPath({ a: { b: { c: 1 } }, c: 2 }, 'a.b'),
            output: { c: 1 }
        },
        {
            input:  utils.getPropertyPath({ 'a-b': { 'c-d': 1} }, 'a-b.c-d'),
            output: 1
        },
        {
            input:  utils.getPropertyPath({ 'a.b': { 'c.d': 1} }, 'a.b.c.d'),
            output: undefined
        }
    ];
    testCases.forEach(function(testCase) {
        t.assertEquals(testCase.input, testCase.output, 'getPropertyPath() gets a property using a path');
    });
})();

t.comment('isArray()');
(function() {
    t.assertEquals(utils.isArray([]), true, 'isArray() checks for an Array');
    t.assertEquals(utils.isArray({}), false, 'isArray() checks for an Array');
    t.assertEquals(utils.isArray("foo"), false, 'isArray() checks for an Array');
})();

t.comment('isClipRect()');
(function() {
    testCases = [
        [{},                                              false],
        [{top: 2},                                        false],
        [{top: 2, left: 2, width: 2, height: 2},          true],
        [{top: 2, left: 2, height: 2, width: 2},          true],
        [{top: 2, left: 2, width: 2, height: new Date()}, false]
    ];

    testCases.forEach(function(testCase) {
        t.assertEquals(utils.isClipRect(testCase[0]), testCase[1], 'isClipRect() checks for a ClipRect');
    });
})();

t.comment('isObject()');
(function() {
    t.assertEquals(utils.isObject({}), true, 'isObject() checks for an Object');
    t.assertEquals(utils.isObject([]), true, 'isObject() checks for an Object');
    t.assertEquals(utils.isObject(1), false, 'isObject() checks for an Object');
    t.assertEquals(utils.isObject("1"), false, 'isObject() checks for an Object');
    t.assertEquals(utils.isObject(function(){}), false, 'isObject() checks for an Object');
    t.assertEquals(utils.isObject(new Function('return {};')()), true, 'isObject() checks for an Object');
    t.assertEquals(utils.isObject(require('webpage').create()), true, 'isObject() checks for an Object');
    t.assertEquals(utils.isObject(null), false, 'isObject() checks for an Object');
})();

t.comment('isWebPage()');
(function() {
    var pageModule = require('webpage');
    t.assertEquals(utils.isWebPage(pageModule), false, 'isWebPage() checks for a WebPage instance');
    t.assertEquals(utils.isWebPage(pageModule.create()), true, 'isWebPage() checks for a WebPage instance');
    t.assertEquals(utils.isWebPage(null), false, 'isWebPage() checks for a WebPage instance');
})();

t.comment('isJsFile()');
(function() {
    testCases = {
        '':             false,
        'toto.png':     false,
        'plop':         false,
        'gniii.coffee': true,
        'script.js':    true
    };

    for (var testCase in testCases) {
        t.assertEquals(utils.isJsFile(testCase), testCases[testCase], 'isJsFile() checks for js file');
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
        t.assertEquals(utils.mergeObjects(testCase.obj1, testCase.obj2), testCase.merged, 'mergeObjects() can merge objects');
    });
})();

t.comment('unique()');
(function() {
    testCases = [
        {
            input:  [1,2,3],
            output: [1,2,3]
        },
        {
            input:  [1,2,3,2,1],
            output: [1,2,3]
        },
        {
            input:  ["foo", "bar", "foo"],
            output: ["foo", "bar"]
        },
        {
            input:  [],
            output: []
        }
    ];
    testCases.forEach(function(testCase) {
        t.assertEquals(utils.unique(testCase.input), testCase.output, 'unique() computes unique values of an array');
    });
})();

t.done();
