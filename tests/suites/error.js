(function(t) {
    var error;

    function foo() {
        bar();
    }

    function bar() {
        throw new CasperError('bar');
    }

    try {
        foo();
    } catch (e) {
        error = e;
    }

    t.assertType(error.stack, "string", "CasperError() has a stack string property set");
    t.assertMatch(error.stack, /^CasperError: bar\s/, "CasperError() has the expected stack value");

    t.done();
})(casper.test);