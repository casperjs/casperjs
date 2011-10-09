phantom.injectJs('casper.js');

var logo;

new phantom.Casper({
    verbose: true
}).start('http://www.google.fr/', function(self) {
    // download the google logo image as base64
    logo = self.base64encode('http://www.google.fr/images/srpr/logo3w.png', 'google_logo.png');
}).run(function(self) {
    self.echo(logo).exit();
});
