var failed = [];

var casper = require('casper').create({
    onStepTimeout: function() {
        failed.push(this.requestUrl);
    }
});

var links = [
    'http://google.com/',
    'http://akei.com/',
    'http://lemonde.fr/',
    'http://liberation.fr/',
    'http://cdiscount.fr/'
];

var timeout = ~~casper.cli.get(0);
if (timeout < 1) {
    timeout = 1000;
}
casper.options.stepTimeout = timeout;

casper.echo("Testing with timeout=" + casper.options.stepTimeout + "ms.");

casper.start();

casper.each(links, function(self, link) {
    self.test.comment('Adding ' + link + ' to test suite');
    self.thenOpen(link, function(self) {
        var testStatus = self.test.pass;
        if (failed.indexOf(self.requestUrl) > -1) {
            self.test.fail(self.requestUrl);
        } else {
            self.test.pass(self.requestUrl);
        }
    });
});

casper.run(function() {
    this.test.renderResults(true);
});
