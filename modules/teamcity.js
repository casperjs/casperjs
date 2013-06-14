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

/*global CasperError console exports phantom require*/

var utils = require('utils');
var fs = require('fs');

/**
 * Generates a value for 'classname' attribute of the JUnit XML report.
 *
 * Uses the (relative) file name of the current casper script without file
 * extension as classname.
 *
 * @param  String  classname
 * @return String
 */
function generateClassName(classname) {
    "use strict";
    classname = classname.replace(phantom.casperPath, "").trim();
    var script = classname || phantom.casperScript;
    if (script.indexOf(fs.workingDirectory) === 0) {
        script = script.substring(fs.workingDirectory.length + 1);
    }
    if (script.indexOf('/') === 0) {
        script = script.substring(1, script.length);
    }
    if (~script.indexOf('.')) {
        script = script.substring(0, script.lastIndexOf('.'));
    }

    // If we have trimmed our string down to nothing, default to script name
    if (!script && phantom.casperScript) {
      script = phantom.casperScript;
    }

    return script || "unknown";
}


function escapeTeamCityText(text) {
    text = text.replace(/\|/g,"||");
    text = text.replace(/\'/g,"|'");
    text = text.replace(/\n/g,"|n");
    text = text.replace(/\r/g,"|r");
    text = text.replace(/\[/g,"|[");
    text = text.replace(/\]/g,"|]");
    return text;
}

function getTeamCityNowDate()
{
    var date = new Date();
    return date.toISOString().replace("Z","+0000");;
}

function getTeamCityEarlierDate(duration)
{
    var date = new Date(new Date() - duration);
    return date.toISOString().replace("Z","+0000");
}

/**
 * Creates a XUnit instance
 *
 * @return XUnit
 */
exports.create = function create() {
    "use strict";
    return new TeamCityExporter();
};

/**
 * JUnit XML (xUnit) exporter for test results.
 *
 */
function TeamCityExporter() {
    "use strict";    
}
exports.TeamCityExporter = TeamCityExporter;

/**
 * Adds a successful test result.
 *
 * @param  String  classname
 * @param  String  name
 */
TeamCityExporter.prototype.addSuccess = function addSuccess(classname, name, duration) {
    "use strict";
    console.log("##teamcity[testStarted name='" + escapeTeamCityText(name) + "' captureStandardOutput='false' timestamp='" + getTeamCityEarlierDate(duration) + "' ]");
    console.log("##teamcity[testFinished name='" + escapeTeamCityText(name) + "' duration='" + duration + "' timestamp='" + getTeamCityNowDate() + "']");
};

/**
 * Adds a failed test result.
 *
 * @param  String  classname
 * @param  String  name
 * @param  String  message
 * @param  String  type
 */
TeamCityExporter.prototype.addFailure = function addFailure(classname, name, message, type, duration, values) {
    "use strict";
    var message = '', details = '';
    if (type) {
        message += type + ' failed';
    }
    if (values && Object.keys(values).length > 0) {
        for (var vname in values) {
            var comment = vname + ': ';
            var value = values[vname];
            try {
                comment += utils.serialize(values[vname]);
            } catch (e) {
                try {
                    comment += utils.serialize(values[vname].toString());
                } catch (e2) {
                    comment += '(unserializable value)';
                }
            }
            details += comment;
        }
    }

    console.log("##teamcity[testStarted name='" + escapeTeamCityText(name) + "' captureStandardOutput='false' timestamp='" + getTeamCityEarlierDate(duration) + "']");
    console.log("##teamcity[testFailed name='" + escapeTeamCityText(name) + "' message='" + escapeTeamCityText(message) +"' details='" + escapeTeamCityText(details) + "' timestamp='" + getTeamCityNowDate() + "']");
    console.log("##teamcity[testFinished name='" + escapeTeamCityText(name) + "' duration='" + duration + "' timestamp='" + getTeamCityNowDate() + "']");
};

TeamCityExporter.prototype.fileStarted = function (filename) {
    var suitename = generateClassName(filename);
    console.log("##teamcity[testSuiteStarted name='" + escapeTeamCityText(suitename) + "' timestamp='" + getTeamCityNowDate() + "']");
};

TeamCityExporter.prototype.fileFinished = function (filename) {
    var suitename = generateClassName(filename);
    console.log("##teamcity[testSuiteFinished name='" + escapeTeamCityText(suitename) + "' timestamp='" + getTeamCityNowDate() + "']");
};

TeamCityExporter.prototype.setSuiteDuration = function setSuiteDuration(duration) {    
};

/**
 * Retrieves generated XML object - actually an HTMLElement.
 *
 * @return HTMLElement
 */
TeamCityExporter.prototype.getXML = function getXML() {
    "use strict";
    return '';
};
