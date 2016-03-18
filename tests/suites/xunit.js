/*eslint strict:0*/
var tester = require('tester');

casper.test.begin('XUnitReporter() initialization', 1, function suite(test) {
    var xunit = require('xunit').create();
    var results = new tester.TestSuiteResult();
    xunit.setResults(results);
    test.assertTruthy(xunit.getSerializedXML(), "XML can be generated");
    test.done();
});

casper.test.begin('XUnitReporter() can hold test suites', 4, function suite(test) {
    var xunit = require('xunit').create();
    var xmlDocument;
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
    xmlDocument = xunit.getXML();

    casper.start();

    test.assertEquals(xmlDocument.querySelectorAll('testsuite').length, 2, "2 test suites exist");
    test.assertTruthy(xmlDocument.querySelector('testsuites[time]'), "Element 'testsuites' has time attribute");
    test.assertTruthy(xmlDocument.querySelector('testsuite[name="foo"][package="foo"]'), "Package foo exists");
    test.assertTruthy(xmlDocument.querySelector('testsuite[name="bar"][package="bar"]'), "Package bar exists");
    test.done();
});

casper.test.begin('XUnitReporter() can hold a suite with a successful test', 1, function suite(test) {
    var xunit = require('xunit').create();
    var xmlDocument;
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
    xmlDocument = xunit.getXML();

    casper.start();
    test.assertTruthy(xmlDocument.querySelector('testsuite[name="foo"][package="foo"][tests="1"][failures="0"] testcase[name="footext"]'), "Successful test case exists");
    test.done();
});

casper.test.begin('XUnitReporter() can handle a failed test', 2, function suite(test) {
    var xunit = require('xunit').create();
    var xmlDocument;
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
    xmlDocument = xunit.getXML();

    casper.start();

    test.assertTruthy(xmlDocument.querySelector('testsuite[name="foo"][package="foo"][tests="1"][failures="1"] testcase[name="footext"] failure[type="footype"]'), "Failure node exists");
    test.assertEquals(xmlDocument.querySelector('failure[type="footype"]').textContent, 'footext');

    test.done();
});

casper.test.begin('XUnitReporter() can handle custom name attribute for a test case', 2, function suite(test) {
    var xunit = require('xunit').create();
    var xmlDocument;
    var results = new tester.TestSuiteResult();
    var suite1 = new tester.TestCaseResult({
        name: 'foo',
        file: '/foo'
    });
    suite1.addFailure({
        success: false,
        type: "footype",
        message: "footext",
        file: "/foo",
        name: "foo bar baz"
    });
    results.push(suite1);
    xunit.setResults(results);
    xmlDocument = xunit.getXML();

    casper.start();

    test.assertTruthy(xmlDocument.querySelector('testsuite[name="foo"][package="foo"][tests="1"][failures="1"] testcase[name="foo bar baz"] failure[type="footype"]'), "Failure node exists");
    test.assertEquals(xmlDocument.querySelector('failure[type="footype"]').textContent, 'footext');
    test.done();
});

casper.test.begin('XUnitReporter() does not have default XML namespace', 1, function suite(test) {
    var xunit = require('xunit').create();
    var xmlDocument;
    var results = new tester.TestSuiteResult();
    var suite1 = new tester.TestCaseResult({
        name: 'foo',
        file: '/foo'
    });
    results.push(suite1);
    xunit.setResults(results);
    xmlDocument = xunit.getXML();

    casper.start();
    test.assertFalsy(xmlDocument.querySelector('testsuites[xmlns]'), "No default namespace");
    test.done();
});

casper.test.begin('XUnitReporter() can handle markup in nodes', 4, function suite(test) {
    var xunit = require('xunit').create();
    var xmlDocument;
    var results = new tester.TestSuiteResult();
    var suite1 = new tester.TestCaseResult({
        name: 'foo',
        file: '/foo'
    });
    suite1.addFailure({
        success: false,
        type: "footype",
        message: "<b>foo</b> <i>bar</i> and <a href=''>baz</a>",
        file: "/foo",
        name: "foo bar baz"
    });
    suite1.addError({
        name: 'foo',
        message: "<b>foo</b> <i>bar</i> and <a href=''>baz</a>"
    });
    suite1.addWarning("<b>some warning markup</b>");
    results.push(suite1);
    xunit.setResults(results);
    xmlDocument = xunit.getXML();

    casper.start();

    test.assertTruthy(xmlDocument.querySelector('testsuite[name="foo"][package="foo"][tests="1"][failures="1"] testcase[name="foo bar baz"] failure[type="footype"]'), "Node exists");
    test.assertEquals(xmlDocument.querySelector('failure[type="footype"]').textContent, "<b>foo</b> <i>bar</i> and <a href=''>baz</a>", "Handles markup in failure node");
    test.assertEquals(xmlDocument.querySelector('error[type="foo"]').textContent, "<b>foo</b> <i>bar</i> and <a href=''>baz</a>", "Handles markup in error node");
    test.assertEquals(xmlDocument.querySelector('system-out').textContent, "<b>some warning markup</b>", "Handles markup in error node")
    test.done();
});
