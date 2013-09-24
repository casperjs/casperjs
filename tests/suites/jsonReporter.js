/*global casper, __utils__*/
/*jshint strict:false*/
var tester = require('tester');
var testpage = require('webpage').create();
var utils = require('utils');

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
  
  //casper.start().setContent(jsonreporter.getJSON());
    var content = jsonreporter.getJSON();
    test.assert(content["suites"]=== 2,' there are 2 suites');
    test.assert(content["testsuites"].length === 2, 'there are 2 testsuites');
    test.assert(content["testsuites"][0]["testsuite"] ==="foo",'first testsuite is foo');
    test.assert(content['testsuites'][1]["testsuite"] ==="bar", 'second testsuite is bar');
    
    test.done();

});
  

casper.test.begin('jsonReporter() can hold a suite with a succesful test', 6, function suite(test) {
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
    //casper.start().setContent(jsonreporter.getJSON());
    var content = jsonreporter.getJSON();
    casper.echo(content);
    test.assert(content["testsuites"][0]["stats"]["tests"] === 1)
    test.assert(content["testsuites"][0]["stats"]["failures"] === 0);
    test.assert(content["testsuites"][0]["stats"]["errors"] === 0);
  
    test.assert(content["testsuites"][0]["tests"][0]["message"] === "footext");
    test.assert(content["testsuites"][0]["tests"][0]["status"] ===  "success");
    test.assert(content["testsuites"][0]["tests"][0]["type"] === "footype");
    test.done();
});

casper.test.begin('jsonReporter() can handle a failed test', 7, function suite(test) {
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
    //casper.start().setContent(jsonreporter.getJSON());
    var content = jsonreporter.getJSON();
    test.assert(content["testsuites"][0]["testsuite"] === "foo", 'The correct testsuite name is foo');
    test.assert(content["testsuites"][0]["stats"]["tests"] === 1, 'The correct number of tests should be 1');
    test.assert(content["testsuites"][0]["stats"]["failures"] ===  1, '1 failure should be in failed testsuite stats');
    test.assert(content["testsuites"][0]["stats"]["errors"] === 0, 'No errors should be in a failed testsuite stats');
    test.assert(content["testsuites"][0]["tests"][0]["status"] === "failure",'The status should be failure');
    test.assert(content["testsuites"][0]["tests"][0]["message"] === "footext",'The message should be footext');
    test.assert(content["testsuites"][0]["tests"][0]["type"] === "footype",'the type should be footype');
    test.done();
});
