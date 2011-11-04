phantom.injectJs('casper.js');

var casper = new phantom.Casper({
    logLevel: "debug",
    verbose: true
});

casper.start('https://twitter.com/#!/twilio', function(self) {
    self.waitForSelector('.tweet-row', function(self) {
        self.captureSelector('twitter.png', 'html');
    }, null, 12000);
});

casper.run(function(self) {
    self.exit();
});