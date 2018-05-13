/*eslint strict:0*/

var setUp, tearDown;

casper.test.setUp(function(test, globalCasper, callback) {
    setTimeout(function() {
        setUp = true;
        callback();
    }, 50);
});

casper.test.tearDown(function(test, globalCasper, callback) {
    setTimeout(function() {
        tearDown = true;
        callback();
        // reset
        casper.test.setUp();
        casper.test.tearDown();
    }, 50);
});

casper.test.begin('setUp() tests', 1, function(test) {
    test.assertTrue(setUp, 'Tester.setUp() executed the async setup function');
    test.done();
});

casper.test.begin('tearDown() tests', 1, function(test) {
    // This test works only, because the setUp-Test was called first..
    test.assertTrue(tearDown, 'Tester.tearDown() executed the async tear down function');
    test.done();
});
