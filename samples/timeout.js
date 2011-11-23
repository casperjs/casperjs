/**
 * Just a silly game.
 *
 * $ phantomjs samples/timeout.js 500
 * Will google.com load in less than 500ms?
 * NOPE.
 * $ phantomjs samples/timeout.js 1000
 * Will google.com load in less than 1000ms?
 * NOPE.
 * $ phantomjs samples/timeout.js 1500
 * Will google.com load in less than 1500ms?
 * NOPE.
 * $ phantomjs samples/timeout.js 2000
 * Will google.com load in less than 2000ms?
 * YES!
 */
phantom.injectJs('casper.js');

if (phantom.args.length === 0) {
    console.log('You must provide a timeout value')
    phantom.exit(1);
} else {
    var timeout = Number(phantom.args[0], 10);
    if (timeout < 1) {
        console.log('A timeout value must be a positive integer')
        phantom.exit(1);
    }
}

var casper = new phantom.Casper({
    timeout: timeout,
    onTimeout: function(self) {
        self.echo('NOPE.', 'RED_BAR').exit();
    }
});

casper.echo('Will google.com load in less than ' + timeout + 'ms?');

casper.start('http://google.com/', function(self) {
    self.echo('YES!', 'GREEN_BAR').exit();
});

casper.run();