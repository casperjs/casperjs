phantom.injectJs('casper.js');

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