(function(t) {
    function createInjector(fn, values) {
        return new phantom.Casper.FunctionArgsInjector(fn, values);
    }

    var testFn = function(a, b) { return a + b; };
    var injector = createInjector(testFn);
    var extract = injector.extract(testFn);

    t.comment('FunctionArgsInjector.extract()');
    t.assertType(extract, "object", 'FunctionArgsInjector.extract() returns an object');
    t.assertEquals(extract.name, null, 'FunctionArgsInjector.extract() process function name as expected');
    t.assertEquals(extract.body, 'return a + b;', 'FunctionArgsInjector.extract() process function body as expected');
    t.assertEquals(extract.args, ['a', 'b'], 'FunctionArgsInjector.extract() process function args as expected');

    var processed;
    eval('processed = ' + injector.process({ a: 1, b: 2 }));

    t.assertEquals(processed(), 3, 'FunctionArgsInjector.process() proccessed the function correctly');

    t.done();
})(casper.test);
