/*global kasper*/
/*jshint strict:false*/
var fs = require('fs');
var modroot = fs.pathJoin(phantom.kasperPath, 'tests', 'sample_modules');

kasper.test.begin('Javascript module loading', 1, function(test) {
    var jsmod;
    try {
        jsmod = require(fs.pathJoin(modroot, 'jsmodule'));
        test.assertTrue(jsmod.ok, 'require() patched version can load a js module');
    } catch (e) {
        test.fail('require() patched version can load a js module');
    }
    test.done();
});

kasper.test.begin('CoffeeScript module loading', 1, function(test) {
    var csmod;
    try {
        csmod = require(fs.pathJoin(modroot, 'csmodule'));
        test.assertTrue(csmod.ok, 'require() patched version can load a coffeescript module');
    } catch (e) {
        test.fail('require() patched version can load a coffeescript module');
    }
    test.done();
});

kasper.test.begin('JSON module loading', 1, function(test) {
    var config;
    try {
        config = require(fs.pathJoin(modroot, 'config.json'));
        test.assertTrue(config.ok, 'require() patched version can load a json module');
    } catch (e) {
        test.fail('require() patched version can load a json module');
    }
    test.done();
});
