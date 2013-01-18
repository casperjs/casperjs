/*global kasper*/
/*jshint strict:false maxparams:99*/
kasper.test.begin('mapping argument context', 1, function(test) {
    kasper.start();
    var context = {
        "_boolean_true":  true,
        "_boolean_false": false,
        "_int_number":    42,
        "_float_number":  1337.42,
        "_string":        "plop! \"Ÿ£$\" 'no'",
        "_array":         [1, 2, 3],
        "_object":        {a: 1, b: 2},
        "_function":      function(){console.log('ok');}
    };
    var result = kasper.evaluate(function(_boolean_true, _boolean_false, _int_number,
                                          _float_number, _string, _array, _object, _function) {
        return [].map.call(arguments, function(arg) {
            return typeof(arg);
        });
    }, context);
    test.assertEquals(
        result.toString(),
        ['boolean', 'boolean', 'number', 'number', 'string', 'object', 'object', 'function'].toString(),
        'kasper.evaluate() handles passed argument context correcly'
    );
    test.done();
});

kasper.test.begin('handling no argument context', 1, function(test) {
    kasper.start();
    test.assertEquals(kasper.evaluate(function() {
        return 42;
    }), 42, 'kasper.evaluate() handles evaluation with no context passed');
    test.done();
});

kasper.test.begin('handling of object context (BC mode)', 3, function(test) {
    kasper.start();
    test.assertEquals(kasper.evaluate(function(a) {
        return [a];
    }, {a: "foo"}), ["foo"], 'kasper.evaluate() accepts an object as arguments context');
    test.assertEquals(kasper.evaluate(function(a, b) {
        return [a, b];
    }, {a: "foo", b: "bar"}), ["foo", "bar"], 'kasper.evaluate() accepts an object as arguments context');
    test.assertEquals(kasper.evaluate(function(a, b, c) {
        return [a, b, c];
    }, {a: "foo", b: "bar", c: "baz"}), ["foo", "bar", "baz"], 'kasper.evaluate() accepts an object as arguments context');
    test.done();
});

kasper.test.begin('handling of array context', 3, function(test) {
    kasper.start();
    test.assertEquals(kasper.evaluate(function(a) {
        return [a];
    }, ["foo"]), ["foo"], 'kasper.evaluate() accepts an array as arguments context');
    test.assertEquals(kasper.evaluate(function(a, b) {
        return [a, b];
    }, ["foo", "bar"]), ["foo", "bar"], 'kasper.evaluate() accepts an array as arguments context');
    test.assertEquals(kasper.evaluate(function(a, b, c) {
        return [a, b, c];
    }, ["foo", "bar", "baz"]), ["foo", "bar", "baz"], 'kasper.evaluate() accepts an array as arguments context');
    test.done();
});

kasper.test.begin('natural arguments context (phantomjs equivalent)', 3, function(test) {
    kasper.start();
    test.assertEquals(kasper.evaluate(function(a) {
        return [a];
    }, "foo"), ["foo"], 'kasper.evaluate() accepts natural arguments context');
    test.assertEquals(kasper.evaluate(function(a, b) {
        return [a, b];
    }, "foo", "bar"), ["foo", "bar"], 'kasper.evaluate() accepts natural arguments context');
    test.assertEquals(kasper.evaluate(function(a, b, c) {
        return [a, b, c];
    }, "foo", "bar", "baz"), ["foo", "bar", "baz"], 'kasper.evaluate() accepts natural arguments context');
    test.done();
});

kasper.test.begin('thenEvaluate() tests', 2, function(test) {
    kasper.start().thenEvaluate(function(a, b) {
        window.a = a
        window.b = b;
    }, "foo", "bar");
    kasper.then(function() {
        test.assertEquals(this.getGlobal('a'), "foo", "kasper.thenEvaluate() sets args");
        test.assertEquals(this.getGlobal('b'), "bar",
            "kasper.thenEvaluate() sets args the same way evaluate() does");
    });
    kasper.run(function() {
        test.done();
    });
});
