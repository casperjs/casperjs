/*jshint strict:false*/
/*global kasperError console phantom require*/

var kasper = require("kasper").create();

var links = [
    "http://google.com/",
    "http://yahoo.com/",
    "http://bing.com/"
];

kasper.start();

kasper.each(links, function(self, link) {
    this.thenOpen(link, function() {
        this.echo(this.getTitle() + " - " + link);
    });
});

kasper.run();
