/*global casper*/
/*jshint strict:false maxstatements:99*/
var utils = require('utils'),
    t = casper.test,
    x = require('casper').selectXPath;

casper.test.begin('utils.betterTypeOf() tests', function(casper) {
    var testCases = [
        {subject: 1, expected: 'number'},
        {subject: '1', expected: 'string'},
        {subject: {}, expected: 'object'},
        {subject: [], expected: 'array'},
        {subject: undefined, expected: 'undefined'},
        {subject: null, expected: 'null'},
        {subject: function(){}, expected: 'function'},
        {subject: window, expected: 'domwindow'},
        {subject: new Date(), expected: 'date'},
        {subject: new RegExp(), expected: 'regexp'}
    ];
    testCases.forEach(function(testCase) {
        this.assertEquals(utils.betterTypeOf(testCase.subject), testCase.expected,
            utils.format('betterTypeOf() detects expected type "%s"', testCase.expected));
    }.bind(this));
    this.done(testCases.length);
});

casper.test.begin('utils.cleanUrl() tests', function(casper) {
    var testCases = {
        'http://google.com/': 'http://google.com/',
        'http://google.com': 'http://google.com/',
        'http://www.google.com/': 'http://www.google.com/',
        'http://www.google.com/?plop=2': 'http://www.google.com/?plop=2',
        'https://google.com/': 'https://google.com/',
        'https://google.com': 'https://google.com/',
        'https://www.google.com/': 'https://www.google.com/',
        'https://www.google.com/?plop=2': 'https://www.google.com/?plop=2',
        'file:///Users/toto/toto.html': 'file:///Users/toto/toto.html',
        '/100': '/100'
    };
    for (var testCase in testCases) {
        this.assertEquals(utils.cleanUrl(testCase), testCases[testCase], 'cleanUrl() cleans an URL');
    }
    this.done(Object.keys(testCases).length);
});

casper.test.begin('utils.clone() tests', function(casper) {
    var a = {a: 1, b: 2, c: [1, 2]};
    this.assertEquals(utils.clone(a), a);
    var b = [1, 2, 3, a];
    this.assertEquals(utils.clone(b), b);
    this.done(2);
});

casper.test.begin('equals() tests', function(casper) {
    this.assert(utils.equals(null, null), 'equals() null equality');
    this.assertNot(utils.equals(null, undefined), 'equals() null vs. undefined inequality');
    this.assert(utils.equals("hi", "hi"), 'equals() string equality');
    this.assertNot(utils.equals("hi", "ih"), 'equals() string inequality');
    this.assert(utils.equals(5, 5), 'equals() number equality');
    this.assertNot(utils.equals("5", 5), 'equals() number equality without implicit cast');
    this.assert(utils.equals(5, 5.0), 'equals() number equality with cast');
    this.assertNot(utils.equals(5, 10), 'equals() number inequality');
    this.assert(utils.equals([], []), 'equals() empty array equality');
    this.assert(utils.equals([1,2], [1,2]), 'equals() array equality');
    this.assert(utils.equals([1,2,[1,2,function(){}]], [1,2,[1,2,function(){}]]), 'equals() complex array equality');
    this.assertNot(utils.equals([1,2,[1,2,function(a){}]], [1,2,[1,2,function(b){}]]), 'equals() complex array inequality');
    this.assertNot(utils.equals([1,2], [2,1]), 'equals() shuffled array inequality');
    this.assertNot(utils.equals([1,2], [1,2,3]), 'equals() array length inequality');
    this.assert(utils.equals({}, {}), 'equals() empty object equality');
    this.assert(utils.equals({a:1,b:2}, {a:1,b:2}), 'equals() object length equality');
    this.assert(utils.equals({a:1,b:2}, {b:2,a:1}), 'equals() shuffled object keys equality');
    this.assertNot(utils.equals({a:1,b:2}, {a:1,b:3}), 'equals() object inequality');
    this.assert(utils.equals({1:{name:"bob",age:28}, 2:{name:"john",age:26}}, {1:{name:"bob",age:28}, 2:{name:"john",age:26}}), 'equals() complex object equality');
    this.assertNot(utils.equals({1:{name:"bob",age:28}, 2:{name:"john",age:26}}, {1:{name:"bob",age:28}, 2:{name:"john",age:27}}), 'equals() complex object inequality');
    this.assert(utils.equals(function(x){return x;}, function(x){return x;}), 'equals() function equality');
    this.assertNot(utils.equals(function(x){return x;}, function(y){return y+2;}), 'equals() function inequality');
    this.assert(utils.equals([{a:1, b:2}, {c:3, d:4}], [{a:1, b:2}, {c:3, d:4}]), 'equals() arrays of objects');
    this.done(23);
});

casper.test.begin('fileExt() tests', function() {
    var testCases = {
        'foo.ext':    'ext',
        'FOO.EXT':    'ext',
        'a.ext':      'ext',
        '.ext':       'ext',
        'toto.':      '',
        ' plop.ext ': 'ext'
    };
    for (var testCase in testCases) {
        this.assertEquals(utils.fileExt(testCase), testCases[testCase], 'fileExt() extract file extension');
    }
    this.done(Object.keys(testCases).length);
});

casper.test.begin('fillBlanks() tests', function() {
    var testCases = {
        'foo':         'foo       ',
        '  foo bar ':  '  foo bar ',
        '  foo bar  ': '  foo bar  '
    };
    for (var testCase in testCases) {
        this.assertEquals(utils.fillBlanks(testCase, 10), testCases[testCase], 'fillBlanks() fills blanks');
    }
    this.done(Object.keys(testCases).length);
});

casper.test.begin('getPropertyPath() tests', function() {
    var testCases = [
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
        this.assertEquals(testCase.input, testCase.output, 'getPropertyPath() gets a property using a path');
    }.bind(this));
    this.done(testCases.length);
});

casper.test.begin('isArray() tests', function() {
    this.assertEquals(utils.isArray([]), true, 'isArray() checks for an Array');
    this.assertEquals(utils.isArray({}), false, 'isArray() checks for an Array');
    this.assertEquals(utils.isArray("foo"), false, 'isArray() checks for an Array');
    this.done(3);
});

casper.test.begin('isClipRect() tests', function() {
    var testCases = [
        [{},                                              false],
        [{top: 2},                                        false],
        [{top: 2, left: 2, width: 2, height: 2},          true],
        [{top: 2, left: 2, height: 2, width: 2},          true],
        [{top: 2, left: 2, width: 2, height: new Date()}, false]
    ];
    testCases.forEach(function(testCase) {
        this.assertEquals(utils.isClipRect(testCase[0]), testCase[1], 'isClipRect() checks for a ClipRect');
    }.bind(this));
    this.done(testCases.length);
});

casper.test.begin('isHTTPResource() tests', function() {
    var testCases = [
        [{},                              false],
        [{url: 'file:///var/www/i.html'}, false],
        [{url: 'mailto:plop@plop.com'},   false],
        [{url: 'ftp://ftp.plop.com'},     false],
        [{url: 'HTTP://plop.com/'},       true],
        [{url: 'https://plop.com/'},      true]
    ];
    testCases.forEach(function(testCase) {
        this.assertEquals(utils.isHTTPResource(testCase[0]), testCase[1], 'isHTTPResource() checks for an HTTP resource');
    }.bind(this));
    this.done(Object.keys(testCases).length);
});

casper.test.begin('isObject() tests', function() {
    this.assertEquals(utils.isObject({}), true, 'isObject() checks for an Object');
    this.assertEquals(utils.isObject([]), true, 'isObject() checks for an Object');
    this.assertEquals(utils.isObject(1), false, 'isObject() checks for an Object');
    this.assertEquals(utils.isObject("1"), false, 'isObject() checks for an Object');
    this.assertEquals(utils.isObject(function(){}), false, 'isObject() checks for an Object');
    this.assertEquals(utils.isObject(new Function('return {};')()), true, 'isObject() checks for an Object');
    this.assertEquals(utils.isObject(require('webpage').create()), true, 'isObject() checks for an Object');
    this.assertEquals(utils.isObject(null), false, 'isObject() checks for an Object');
    this.done(8);
});

casper.test.begin('isValidSelector() tests', function() {
    t.assertEquals(utils.isValidSelector({}), false, 'isValidSelector() checks for a valid selector');
    t.assertEquals(utils.isValidSelector(""), false, 'isValidSelector() checks for a valid selector');
    t.assertEquals(utils.isValidSelector("a"), true, 'isValidSelector() checks for a valid selector');
    t.assertEquals(utils.isValidSelector('div#plop form[name="form"] input[type="submit"]'), true, 'isValidSelector() checks for a valid selector');
    t.assertEquals(utils.isValidSelector(x('//a')), true, 'isValidSelector() checks for a valid selector');
    t.assertEquals(utils.isValidSelector({
        type: "css",
        path: 'div#plop form[name="form"] input[type="submit"]'
    }), true, 'isValidSelector() checks for a valid selector');
    t.assertEquals(utils.isValidSelector({
        type: "xpath",
        path: '//a'
    }), true, 'isValidSelector() checks for a valid selector');
    t.assertEquals(utils.isValidSelector({
        type: "css"
    }), false, 'isValidSelector() checks for a valid selector');
    t.assertEquals(utils.isValidSelector({
        type: "xpath"
    }), false, 'isValidSelector() checks for a valid selector');
    t.assertEquals(utils.isValidSelector({
        type: "css3",
        path: "a"
    }), false, 'isValidSelector() checks for a valid selector');
    this.done(10);
});

casper.test.begin('isWebPage() tests', function() {
    var pageModule = require('webpage');
    this.assertEquals(utils.isWebPage(pageModule), false, 'isWebPage() checks for a WebPage instance');
    this.assertEquals(utils.isWebPage(pageModule.create()), true, 'isWebPage() checks for a WebPage instance');
    this.assertEquals(utils.isWebPage(null), false, 'isWebPage() checks for a WebPage instance');
    this.done(3);
});

casper.test.begin('isJsFile() tests', function() {
    var testCases = {
        '':             false,
        'toto.png':     false,
        'plop':         false,
        'gniii.coffee': true,
        'script.js':    true
    };
    for (var testCase in testCases) {
        this.assertEquals(utils.isJsFile(testCase), testCases[testCase], 'isJsFile() checks for js file');
    }
    this.done(Object.keys(testCases).length);
});

casper.test.begin('mergeObjects() tests', function() {
    var testCases = [
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
        this.assertEquals(utils.mergeObjects(testCase.obj1, testCase.obj2), testCase.merged, 'mergeObjects() can merge objects');
    }.bind(this));
    this.done(testCases.length);
});

casper.test.begin('objectValues() tests', function() {
    this.assertEquals(utils.objectValues({}), [], 'objectValues() can extract object values');
    this.assertEquals(utils.objectValues({a: 1, b: 2}), [1, 2], 'objectValues() can extract object values');
});

casper.test.begin('unique() tests', function() {
    var testCases = [
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
        this.assertEquals(utils.unique(testCase.input), testCase.output, 'unique() computes unique values of an array');
    }.bind(this));
    this.done(testCases.length);
});
