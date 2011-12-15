var fs = require('fs');

phantom.injectJs(fs.pathJoin(phantom.casperLibPath, 'vendors', 'esprima.js'));

var casper = new phantom.Casper({
    faultTolerant: false,
    verbose:       true
});

var tests = [];
if (phantom.args.length > 2 && fs.isFile(phantom.args[2])) {
    tests = [phantom.args[2]];
} else {
    tests = [fs.absolute(fs.pathJoin(phantom.casperLibPath, '..', 'tests', 'suites'))];
}

// Overriding Casper.open to prefix all test urls
phantom.Casper.extend({
    open: function(location, options) {
        options = isType(options, "object") ? options : {};
        this.requestUrl = location;
        var url = 'file://' + phantom.casperPath + '/' + location;
        this.page.open(url);
        return this;
    }
});

casper.test.runSuites.apply(casper.test, tests);
