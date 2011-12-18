if (!phantom.casperLoaded) {
    console.log('This script must be invoked using the casperjs executable');
    phantom.exit(1);
}

var fs = require('fs');

phantom.injectJs(fs.pathJoin(phantom.casperPath, 'lib', 'vendors', 'esprima.js'));

var casper = new phantom.Casper({
    faultTolerant: false,
    verbose:       true
});

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

(function(casper) {
    var tests = [];
    if (phantom.casperArgs.args.length > 2 && fs.isFile(phantom.casperArgs.args[2])) {
        tests = [phantom.casperArgs.args[2]];
    } else {
        tests = [fs.absolute(fs.pathJoin(phantom.casperPath, 'tests', 'suites'))];
    }
    casper.test.runSuites.apply(casper.test, tests);
})(casper);
