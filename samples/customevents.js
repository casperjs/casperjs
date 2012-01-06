var casper = require('casper').create();

// listening to a custom event
casper.on('google.loaded', function(title) {
    casper.echo('Google page title is ' + title);
});

casper.start('http://google.com/', function(self) {
    // emitting a custom event
    self.emit('google.loaded', self.getTitle());
});

casper.run();