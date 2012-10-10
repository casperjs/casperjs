var fs = require('fs');

var t = casper.test;

casper.start();

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
    t.comment('Tester.assertField()');
    t.assertField('dummy_name', 'dummy_value', 'Tester.assertField() works as expected');

    t.comment('Tester.assertTextExists()');
    t.assertTextExists('form', 'Tester.assertTextExists() checks that page body contains text');

    t.comment('Tester.assertSelectorHasText()');
    t.assertSelectorHasText('h1', 'Title', 'Tester.assertSelectorHasText() works as expected');

    t.comment('Tester.assertSelectorDoesntHaveText()');
    t.assertSelectorDoesntHaveText('h1', 'Subtitle', 'Tester.assertSelectorDoesntHaveText() works as expected');
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
    t.assertHttpStatus(200, 'Tester.assertHttpStatus() works as expected');

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

    t.comment('Tester.assertTitleMatch()');
    t.assertTitleMatch(/test index/, 'Tester.assertTitleMatch() works as expected');

    t.comment('Tester.assertType()');
    t.assertType("plop", "string", "Tester.assertType() works as expected");

    t.comment('Tester.assertUrlMatch()');
    t.assertUrlMatch(/index\.html$/, "Tester.assertUrlMatch() works as expected");

    t.comment('Tester.assertVisible()');
    t.assertVisible('img', 'Tester.assertVisible() works as expected');

    t.comment('Tester.assertNotVisible()');
    t.assertNotVisible('p#hidden', 'Tester.assertNotVisible() works as expected');
});

casper.then(function() {
    t.comment('Tester.getFailures()');
    t.assertEquals(typeof t.getFailures().length, "number", "Tester.getFailures() works as expected");

    var passCount = t.getPasses().length;
    t.comment('Tester.getPasses()');
    t.assertEquals(1, 1, "Rogue assertEquals pass case");
    t.assertEquals(t.getPasses().length, passCount + 1, "Tester.getPasses() works as expected");
});

casper.run(function() {
    t.done();
});
