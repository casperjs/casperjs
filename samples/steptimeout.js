var failed = [];

var casper = require('casper').create({
    onStepTimeout: function(self) {
        failed.push(self.requestUrl);
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
casper.options.stepTimeout = timeout > 0 ? timeout : 1000;

casper.echo('Testing with timeout=' + casper.options.stepTimeout + 'ms.');

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

casper.run(function(self) {
    self.test.renderResults(true);
});
