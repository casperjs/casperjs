var casper = require('casper').create({
    logLevel: "debug",
    verbose: true,
    viewportSize: {
        width: 1024,
        height: 768
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
