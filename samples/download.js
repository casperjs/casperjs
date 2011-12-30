// download the google logo image as base64

var casper = require('casper').create({
    verbose: true
});

casper.start('http://www.google.fr/', function(self) {
    self.echo(self.base64encode('http://www.google.fr/images/srpr/logo3w.png'));
});

casper.run();
