var require = patchRequire(require);
var casper = require('casper').create();
var utils = require('utils');
utils.dump(casper.cli.options);
casper.exit();
