/*jshint strict:false*/
/*global kasperError console phantom require*/

/**
 * This script will add a custom HTTP status code handler, here for 404 pages.
 */
var kasper = require("kasper").create();

kasper.on("http.status.200", function(resource) {
    this.echo(resource.url + " is OK", "INFO");
});

kasper.on("http.status.301", function(resource) {
    this.echo(resource.url + " is permanently redirected", "PARAMETER");
});

kasper.on("http.status.302", function(resource) {
    this.echo(resource.url + " is temporarily redirected", "PARAMETER");
});

kasper.on("http.status.404", function(resource) {
    this.echo(resource.url + " is not found", "COMMENT");
});

kasper.on("http.status.500", function(resource) {
    this.echo(resource.url + " is in error", "ERROR");
});

var links = [
    "http://google.com/",
    "http://www.google.com/",
    "http://www.google.com/plop"
];

kasper.start();

kasper.each(links, function(self, link) {
    self.thenOpen(link, function() {
        this.echo(link + " loaded");
    });
});

kasper.run();
