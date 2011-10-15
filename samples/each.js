phantom.injectJs('casper.js');

var links = [
    'http://google.com/',
    'http://yahoo.com/',
    'http://bing.com/'
];
var casper = new phantom.Casper();
var i = 0;
var titles = [];

casper.start();

casper.each(links, function(self, link) {
    self.thenOpen(link, function(self) {
        self.echo(self.getTitle());
    });
});

casper.run(function(self) {
    self.exit();
});
