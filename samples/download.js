if (!phantom.casperLoaded) {
    console.log('This script is intended to work with CasperJS, using its executable.');
    phantom.exit(1);
}

var logo;

new phantom.Casper({
    verbose: true
}).start('http://www.google.fr/', function(self) {
    // download the google logo image as base64
    logo = self.base64encode('http://www.google.fr/images/srpr/logo3w.png');
}).run(function(self) {
    self.echo(logo).exit();
});
