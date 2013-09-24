/*global casper, __utils__*/
/*jshint strict:false*/
var tester = require('tester');
var testpage = require('webpage').create();

casper.test.begin('jsonReporter() initialization', 1, function suite(test) {
    var jsonreporter = require('jsonreport').create();
    var results = new tester.TestSuiteResult();
    jsonreporter.setResults(results);
    test.assertTruthy(jsonreporter.getJSON());
    test.done();
});

casper.test.begin('jsonReporter() can hold test suites', 4, function suite(test) {
    var jsonreporter = require('jsonreport').create();
    var results = new tester.TestSuiteResult();
    var suite1 = new tester.TestCaseResult({
        name: 'foo',
        file: '/foo'
    });
    results.push(suite1);
    var suite2 = new tester.TestCaseResult({
        name: 'bar',
        file: '/bar'
    });
    results.push(suite2);
    jsonreporter.setResults(results);
    casper.start().setContent(jsonreporter.getJSON());
    //test.assertEvalEquals(function() {
    //    return __utils__.findAll('testsuite').length;
    //}, 2);
    test.assertTextExists('"suites":2');
    test.assertTextExists('"testsuite":"foo"');
    test.assertTextExists('"testsuite":"bar"');
    var content = JSON.parse(this.getPageContent());
    test.assertEquals(content.testsuites.length,2);
    test.done();
});

casper.test.begin('jsonReporter() can hold a suite with a succesful test', 2, function suite(test) {
    var jsonreporter = require('jsonreport').create();
    var results = new tester.TestSuiteResult();
    var suite1 = new tester.TestCaseResult({
        name: 'foo',
        file: '/foo'
    });
    suite1.addSuccess({
        success: true,
        type: "footype",
        message: "footext",
        file: "/foo",
    });
    results.push(suite1);
    jsonreporter.setResults(results);
    casper.start().setContent(jsonreporter.getJSON());
    var content = JSON.parse(this.getPageContent());
    test.assertTextExists('"suite":1,"testsuites":[{"testsuite":"foo","stats":{tests:1,"failures":0,"errors":0');
    test.assertTextExists('"status":"success","message":"footext","type":"footype"');
    test.done();
});

casper.test.begin('jsonReporter() can handle a failed test', 2, function suite(test) {
    var jsonreporter = require('jsonreport').create();
    var results = new tester.TestSuiteResult();
    var suite1 = new tester.TestCaseResult({
        name: 'foo',
        file: '/foo'
    });
    suite1.addFailure({
        success: false,
        type: "footype",
        message: "footext",
        file: "/foo"
    });
    results.push(suite1)
    jsonreporter.setResults(results);
    casper.start().setContent(jsonreporter.getJSON());
    test.assertExists('"suite":1,"testsuites":[{"testsuite":"foo","stats":{tests:1,"failures":1,"errors":0');
    test.assertExists('"status":"failure","message":"footext","type":"footype"');
    test.done();
});
