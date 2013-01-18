/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('page.error event tests', 2, function(test) {
    var error = {};
    kasper.once("page.error", function onError(msg, trace) {
        error.msg = msg;
        error.trace = trace;
    });
    kasper.start('tests/site/error.html', function() {
        test.assertEquals(error.msg, "ReferenceError: Can't find variable: plop",
            "page.error event has been caught OK");
        test.assertMatch(error.trace[0].file, /error.html/,
            "page.error retrieves correct stack trace");
    });
    kasper.run(function() {
        test.done();
    });
});
