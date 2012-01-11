casper.test.comment('Casper.evaluate()');

casper.start();

var params = {
    "boolean true":  true,
    "boolean false": false,
    "int number":    42,
    "float number":  1337.42,
    "string":        "plop! \"Ÿ£$\" 'no'",
    "array":         [1, 2, 3],
    "object":        {a: 1, b: 2}
};

var casperParams = casper.evaluate(function() {
    return __casper_params__;
}, params);

casper.test.assertType(casperParams, "object", 'Casper.evaluate() exposes parameters in a dedicated object');
casper.test.assertEquals(Object.keys(casperParams).length, 7, 'Casper.evaluate() object containing parameters has the correct length');

for (var param in casperParams) {
    casper.test.assertEquals(JSON.stringify(casperParams[param]), JSON.stringify(params[param]), 'Casper.evaluate() can pass a ' + param);
    casper.test.assertEquals(typeof casperParams[param], typeof params[param], 'Casper.evaluate() preserves the ' + param + ' type');
}

casper.test.done();
