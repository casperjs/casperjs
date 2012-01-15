var casper = require('casper').create();

var links = [
    'http://google.com/',
    'http://yahoo.com/',
    'http://bing.com/'
];

casper.start().each(links, function(self, link) {
    self.thenOpen(link, function(self) {
        self.echo(self.getTitle() + ' - ' + link);
    });
});

casper.run();
