if (!phantom.casperLoaded) {
    console.log('This script is intended to work with CasperJS, using its executable.');
    phantom.exit(1);
}

var casper = new phantom.Casper({
    logLevel: "debug",
    verbose: true,
    viewportSize: {
        width: 800,
        height: 600
    }
});

casper.start('https://twitter.com/#!/twilio', function(self) {
    self.waitForSelector('.tweet-row', function(self) {
        self.captureSelector('twitter.png', 'html');
    }, null, 12000);
});

casper.run(function(self) {
    self.exit();
});
