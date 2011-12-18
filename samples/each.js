if (!phantom.casperLoaded) {
    console.log('This script is intended to work with CasperJS, using its executable.');
    phantom.exit(1);
}

var links = [
    'http://google.com/',
    'http://yahoo.com/',
    'http://bing.com/'
];
var casper = new phantom.Casper();

casper.start();

casper.each(links, function(self, link) {
    self.thenOpen(link, function(self) {
        self.echo(self.getTitle());
    });
});

casper.run(function(self) {
    self.exit();
});
