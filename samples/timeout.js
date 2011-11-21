phantom.injectJs('casper.js');

var casper = new phantom.Casper({
    logLevel: "debug",
    verbose: true,
    timeout: 2000,
    onTimeout: function(self) {
        self.die('script execution timeout exceeded');
    }
});

casper.start('http://google.com/', function(self) {
    self.log('google is loaded');
});

casper.run(function(self) {
    self.log('oops, forgot to call Casper.exit()');
});