if (!phantom.casperLoaded) {
    console.log('This script is intended to work with CasperJS, using its executable.');
    phantom.exit(1);
}

var links = [];
var casper = new phantom.Casper({
    httpStatusHandlers: {
        404: function(self, resource) {
            self.echo('Resource at ' + resource.url + ' not found (404)');
        }
    },
    verbose: true
});

casper.start('http://www.google.com/plop', function(self) {
    self.echo('Done.').exit();
});
casper.run();