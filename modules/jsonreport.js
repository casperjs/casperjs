/*!
 * Casper is a navigation utility for PhantomJS.
 *
 * Documentation: http://casperjs.org/
 * Repository:    http://github.com/n1k0/casperjs
 *
 * Copyright (c) 2011-2012 Nicolas Perriault
 *
 * Part of source code is Copyright Joyent, Inc. and other Node contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*global CasperError, console, exports, phantom, patchRequire, require:true*/

var require = patchRequire(require);
var utils = require('utils');
var TestSuiteResult = require('tester').TestSuiteResult;

/**
 * Creates a json instance
 *
 * @return 
 */
exports.create = function create() {
    "use strict";
    return new JsonExporter();
};

/**
 * json mocha style exporter for test results.
 *
 */
function JsonExporter(){
    "use strict";
    this.results = undefined; //we didn't get them yet
    this._json = {};
    var testList = [];
    this._json.toString = function toString(){ //overriding the default toString to enable my custom serializtion
        return JSON.stringify(this,null,2);
    };
}
exports.jsonExporter = JsonExporter;
JsonExporter.prototype.getDataFormat= function getDataFormat(){
  "use strict";
  if (!(this.results instanceof TestSuiteResult)){ //first check if the results we are proccessing are an instance of casper testsuite. if not bye bye
    throw new CasperError('Results not set, cannot get JSON');
  }
  this._json['suites'] = this.results.length;
  this._json['testsuites'] = [];
  this.results.forEach(function(result){
  var testsuite = {}
  var testList = [];

  var suite = {
    tests: result.assertions,
    failures: result.failed,
    errors:result.crashed,
    duration: utils.ms2seconds(result.calculateDuration()),
    timestamp:(new Date()).toISOString() //why is date enclosed in parthensis?

    };
  testsuite.testsuite = result.name;
  testsuite.stats = suite;

  result.passes.forEach(function(success){
    var testCase = {
        status: "success",
        message: success.message,
        type: success.type,
        values: success.values,
        time: utils.ms2seconds(~~success.time)
    }
    testList.push(testCase);
  });
  result.failures.forEach(function(failure){
    var testcase = {
        status: "failure",
        message: failure.message || failure.standard,
        time: utils.ms2seconds(~~failure.time),
        type: failure.type || "failure"
    };
    if (failure.values && failure.values.error instanceof Error) {
        var failureStack =  {
            type: utils.betterTypeOf(failure.values.error),
            stack: failure.values.error.stack
            };
        testcase.push(failureStack);
    }
    testList.push(testcase);

});
  result.errors.forEach(function(error){
    var testcase = {
        status: "error",
        type: error.name
    };
    var errorStack = {
        stack: error.stack || error.message
    };
    testcase.push(errorStack);
    testList.push(testcase);
    });
  testsuite.warnings = result.warnings.join('\n');
  testsuite.tests = testList;
  this._json['testsuites'].push(testsuite);


  }.bind(this));
  return this._json;
};
/**
 * Sets test results.
 *
 * @param TestSuite results
 */
JsonExporter.prototype.setResults = function setResults(results){
    "use strict";
    if (!(results instanceof TestSuiteResult)){
        throw new CasperError('invalid results type.');
    }
    this.results = results;
    return results;
};
