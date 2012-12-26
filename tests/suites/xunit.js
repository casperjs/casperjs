/*global casper*/
/*jshint strict:false*/
var tester = require('tester');
var testpage = require('webpage').create();

casper.test.begin('XUnitReporter() initialization', function suite() {
    var xunit = require('xunit').create();
    var results = new tester.TestSuiteResult();
    xunit.setResults(results);
    this.assertTruthy(xunit.getXML());
    this.done(1);
});

casper.test.begin('XUnitReporter() can hold test suites', function suite() {
    var xunit = require('xunit').create();
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
    xunit.setResults(results);
    casper.start().setContent(xunit.getXML());
    this.assertEvalEquals(function() {
        return __utils__.findAll('testsuite').length;
    }, 2);
    this.assertExists('testsuites[duration]');
    this.assertExists('testsuite[name="foo"][package="foo"]');
    this.assertExists('testsuite[name="bar"][package="bar"]');
    this.done(4);
});

casper.test.begin('XUnitReporter() can hold a suite with a succesful test', function suite() {
    var xunit = require('xunit').create();
    var results = new tester.TestSuiteResult();
    var suite1 = new tester.TestCaseResult({
        name: 'foo',
        file: '/foo'
    });
    suite1.addSuccess({
        success: true,
        type: "footype",
        message: "footext",
        file: "/foo"
    });
    results.push(suite1);
    xunit.setResults(results);
    casper.start().setContent(xunit.getXML());
    this.assertExists('testsuite[name="foo"][package="foo"][tests="1"][failures="0"] testcase[name="footext"]');
    casper.test.done(1);
});

casper.test.begin('XUnitReporter() can handle a failed test', function suite() {
    var xunit = require('xunit').create();
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
    results.push(suite1);
    xunit.setResults(results);
    casper.start().setContent(xunit.getXML());
    this.assertExists('testsuite[name="foo"][package="foo"][tests="1"][failures="1"] testcase[name="footext"] failure[type="footype"]');
    this.assertEquals(casper.getElementInfo('failure[type="footype"]').text, 'footext');
    casper.test.done(2);
});
