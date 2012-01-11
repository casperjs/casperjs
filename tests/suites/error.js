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

casper.test.assertType(error.stack, "string", "CasperError() has a stack string property set");
casper.test.assertMatch(error.stack, /^CasperError: bar\s/, "CasperError() has the expected stack value");

casper.test.done();
