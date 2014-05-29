/*jshint strict:false*/
/*global CasperError, casper, console, phantom, require*/
var fs = require('fs');

casper.test.begin('Testsuite 0', 1, function suite(test) {
    test.assertEquals(test.currentSuiteNum, 0, 'first suite is #0');
    test.done();
});
casper.test.begin('Testsuite 1', 1, function suite(test) {
    test.assertEquals(test.currentSuiteNum, 1, 'first suite is #1');
    test.done();
});
casper.test.begin('Testsuite 2', 1, function suite(test) {
    test.assertEquals(test.currentSuiteNum, 2, 'first suite is #2');
    test.done();
});
