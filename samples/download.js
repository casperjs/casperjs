/*
Download the google logo image as base64
*/

var casper;

casper = require("casper").create({
    verbose: true
});

casper.start("http://www.google.fr/", function() {
    this.echo(this.base64encode("http://www.google.fr/images/srpr/logo3w.png"));
});

casper.run();
