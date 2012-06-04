var fs = require('fs');

var t = casper.test;

casper.start();

t.comment('Tester.testEquals()');
t.assert(t.testEquals(null, null), 'Tester.testEquals() null equality');
t.assertNot(t.testEquals(null, undefined), 'Tester.testEquals() null vs. undefined inequality');
t.assert(t.testEquals("hi", "hi"), 'Tester.testEquals() string equality');
t.assertNot(t.testEquals("hi", "ih"), 'Tester.testEquals() string inequality');
t.assert(t.testEquals(5, 5), 'Tester.testEquals() number equality');
t.assertNot(t.testEquals("5", 5), 'Tester.testEquals() number equality without implicit cast');
t.assert(t.testEquals(5, 5.0), 'Tester.testEquals() number equality with cast');
t.assertNot(t.testEquals(5, 10), 'Tester.testEquals() number inequality');
t.assert(t.testEquals([], []), 'Tester.testEquals() empty array equality');
t.assert(t.testEquals([1,2], [1,2]), 'Tester.testEquals() array equality');
t.assert(t.testEquals([1,2,[1,2,function(){}]], [1,2,[1,2,function(){}]]), 'Tester.testEquals() complex array equality');
t.assertNot(t.testEquals([1,2,[1,2,function(a){}]], [1,2,[1,2,function(b){}]]), 'Tester.testEquals() complex array inequality');
t.assertNot(t.testEquals([1,2], [2,1]), 'Tester.testEquals() shuffled array inequality');
t.assertNot(t.testEquals([1,2], [1,2,3]), 'Tester.testEquals() array length inequality');
t.assert(t.testEquals({}, {}), 'Tester.testEquals() empty object equality');
t.assert(t.testEquals({a:1,b:2}, {a:1,b:2}), 'Tester.testEquals() object length equality');
t.assert(t.testEquals({a:1,b:2}, {b:2,a:1}), 'Tester.testEquals() shuffled object keys equality');
t.assertNot(t.testEquals({a:1,b:2}, {a:1,b:3}), 'Tester.testEquals() object inequality');
t.assert(t.testEquals({1:{name:"bob",age:28}, 2:{name:"john",age:26}}, {1:{name:"bob",age:28}, 2:{name:"john",age:26}}), 'Tester.testEquals() complex object equality');
t.assertNot(t.testEquals({1:{name:"bob",age:28}, 2:{name:"john",age:26}}, {1:{name:"bob",age:28}, 2:{name:"john",age:27}}), 'Tester.testEquals() complex object inequality');
t.assert(t.testEquals(function(x){return x;}, function(x){return x;}), 'Tester.testEquals() function equality');
t.assertNot(t.testEquals(function(x){return x;}, function(y){return y+2;}), 'Tester.testEquals() function inequality');

t.comment('Tester.sortFiles()');
var testDirRoot = fs.pathJoin(phantom.casperPath, 'tests', 'testdir');
var files = t.findTestFiles(testDirRoot);
var expected = [
    "01_a/abc.js",
    "01_a/def.js",
    "02_b/abc.js",
    "03_a.js",
    "03_b.js",
    "04/01_init.js",
    "04/02_do.js"
].map(function(entry) {
    return fs.pathJoin.apply(fs, [testDirRoot].concat(entry.split('/')));
});
t.assertEquals(files, expected, 'findTestFiles() find test files and sort them');

casper.thenOpen('tests/site/index.html', function() {
    t.comment('Tester.assertTextExists()');
    t.assertTextExists('form', 'Tester.assertTextExists() checks that page body contains text');
});

casper.then(function() {
    t.comment('Tester.assert()');
    t.assert(true, 'Tester.assert() works as expected');

    t.comment('Tester.assertNot()');
    t.assertNot(false, 'Tester.assertNot() works as expected');

    t.comment('Tester.assertEquals()');
    t.assertEquals(true, true, 'Tester.assertEquals() works as expected');

    t.comment('Tester.assertNotEquals()');
    t.assertNotEquals(true, false, 'Tester.assertNotEquals() works as expected');

    t.comment('Tester.assertEval()');
    t.assertEval(function() {
        return true;
    }, 'Tester.assertEval() works as expected');

    t.comment('Tester.assertEvalEquals()');
    t.assertEvalEquals(function() {
        return 42;
    }, 42, 'Tester.assertEvalEquals() works as expected');

    t.comment('Tester.assertExists()');
    t.assertExists('body', 'Tester.assertExists() works as expected');

    t.comment('Tester.assertDoesntExist()');
    t.assertDoesntExist('foobar', 'Tester.assertDoesntExist() works as expected');

    t.comment('Tester.assertHttpStatus()');
    // using file:// protocol, HTTP status is always null
    t.assertHttpStatus(null, 'Tester.assertHttpStatus() works as expected');

    t.comment('Tester.assertMatch()');
    t.assertMatch("the lazy dog", /lazy/, 'Tester.assertMatch() works as expected');

    t.comment('Tester.assertRaises()');
    t.assertRaises(function() {
        throw new Error('plop');
    }, [], 'Tester.assertRaises() works as expected');

    t.comment('Tester.assertResourceExists()');
    t.assertResourceExists(/index\.html/, 'Tester.assertResourceExists() works as expected');

    t.comment('Tester.assertTitle()');
    t.assertTitle('CasperJS test index', 'Tester.assertTitle() works as expected');

    t.comment('Tester.assertType()');
    t.assertType("plop", "string", "Tester.assertType() works as expected");

    t.comment('Tester.assertUrlMatch()');
    t.assertUrlMatch(/index\.html$/, "Tester.assertUrlMatch() works as expected");
});

casper.run(function() {
    t.done();
});
