var logo;

var casper = require('casper').create({
    verbose: true
});

casper.start('http://www.google.fr/', function(self) {
    // download the google logo image as base64
    logo = self.base64encode('http://www.google.fr/images/srpr/logo3w.png');
});

casper.run(function(self) {
    self.echo(logo).exit();
});
