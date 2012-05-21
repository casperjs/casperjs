var casper, links;

casper = require("casper").create();

links = [
    "http://google.com/",
    "http://yahoo.com/",
    "http://bing.com/"
];

casper.start();

casper.each(links, function(self, link) {
    this.thenOpen(link, function() {
        this.echo(this.getTitle() + " - " + link);
    });
});

casper.run();
