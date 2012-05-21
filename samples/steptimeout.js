var casper, failed, links, timeout,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

failed = [];

casper = require("casper").create({
    onStepTimeout: function() {
        failed.push(this.requestUrl);
    }
});

links = [
    'http://google.com/',
    'http://akei.com/',
    'http://lemonde.fr/',
    'http://liberation.fr/',
    'http://cdiscount.fr/'
];

timeout = ~~casper.cli.get(0);

if (timeout < 1) {
    timeout = 1000;
}

casper.options.stepTimeout = timeout;

casper.echo("Testing with timeout=" + casper.options.stepTimeout + "ms.");

casper.start();

casper.each(links, function(self, link) {
    this.test.comment("Adding " + link + " to test suite");
    this.thenOpen(link, function() {
        var _ref;
        if (_ref = this.requestUrl, __indexOf.call(failed, _ref) >= 0) {
            this.test.fail("" + this.requestUrl + " loaded in less than " + timeout + "ms.");
        } else {
            this.test.pass("" + this.requestUrl + " loaded in less than " + timeout + "ms.");
        }
    });
});

casper.run(function() {
    this.test.renderResults(true);
});
