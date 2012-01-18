casper.test.comment('phantom.Casper.XUnitExporter');

xunit = require('xunit').create(casper);
xunit.addSuccess('bar');
casper.test.assertMatch(xunit.getXML(), /<testcase classname="tests\/suites\/xunit" name="bar"/, 'XUnitExporter.addSuccess() adds a successful testcase');
xunit.addFailure('baz', 'wrong', 'chucknorriz');
casper.test.assertMatch(xunit.getXML(), /<testcase classname="tests\/suites\/xunit" name="baz"><failure type="chucknorriz">wrong/, 'XUnitExporter.addFailure() adds a failed testcase');

casper.test.done();
