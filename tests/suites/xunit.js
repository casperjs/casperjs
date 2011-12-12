(function(t) {
    t.comment('phantom.Casper.XUnitExporter');

    xunit = new phantom.Casper.XUnitExporter();
    xunit.addSuccess('foo', 'bar');
    t.assertMatch(xunit.getXML(), /<testcase classname="foo" name="bar"/, 'XUnitExporter.addSuccess() adds a successful testcase');
    xunit.addFailure('bar', 'baz', 'wrong', 'chucknorriz');
    t.assertMatch(xunit.getXML(), /<testcase classname="bar" name="baz"><failure type="chucknorriz">wrong/, 'XUnitExporter.addFailure() adds a failed testcase');

    t.done();
})(casper.test);
