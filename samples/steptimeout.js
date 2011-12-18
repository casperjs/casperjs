if (!phantom.casperLoaded) {
    console.log('This script is intended to work with CasperJS, using its executable.');
    phantom.exit(1);
}

if (phantom.casperArgs.args.length === 0) {
    console.log('You must provide a timeout value');
    phantom.exit(1);
}

var timeout = Number(phantom.casperArgs.args[0], 10);

if (timeout < 1) {
    console.log('A timeout value must be a positive integer');
    phantom.exit(1);
}

var casper = new phantom.Casper({
    stepTimeout: timeout,
    onStepTimeout: function(self) {
        self.echo(self.requestUrl + ' failed to load in less than ' + timeout + 'ms', 'ERROR');
    }
});

var links = [
    'http://google.com/',
    'http://lemonde.fr/',
    'http://liberation.fr/',
    'http://cdiscount.fr/'
];

casper.echo('Testing with timeout=' + timeout + 'ms.');

casper.start();

casper.each(links, function(self, link, i) {
    self.test.comment('Adding ' + link + ' to test suite');
    self.thenOpen(link, function(self) {
        self.echo(self.requestUrl + ' loaded');
    });
});

casper.run(function(self) {
    self.test.renderResults(true);
    self.exit();
});