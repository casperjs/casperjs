/*global casper*/
/*jshint strict:false*/
var fs = require('fs');
var modroot = fs.pathJoin(phantom.casperPath, 'tests', 'suites', 'modules');
var jsmod = require(fs.pathJoin(modroot, 'jsmodule'));
var csmod = require(fs.pathJoin(modroot, 'csmodule'));

casper.test.assertTrue(jsmod.ok, 'require() patched version can load a js module');
casper.test.assertTrue(csmod.ok, 'require() patched version can load a coffeescript module');

casper.test.done();
