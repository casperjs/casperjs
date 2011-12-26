var casper = require('casper').create({
    verbose: true
});

function countLinks() {
    return document.querySelectorAll('a').length;
}

var suites = [
    function(self) {
        self.echo('Suite 1');
        self.start('http://google.com/', function(self) {
            self.echo('Page title: ' + self.getTitle());
        }).then(function(self) {
            self.echo(self.evaluate(countLinks) + ' links');
        });
    },
    function(self) {
        self.echo('Suite 2');
        self.start('http://yahoo.com/', function(self) {
            self.echo('Page title: ' + self.getTitle());
        }).then(function(self) {
            self.echo(self.evaluate(countLinks) + ' links');
        });
    },
    function(self) {
        self.echo('Suite 3');
        self.start('http://bing.com/', function(self) {
            self.echo('Page title: ' + self.getTitle());
        }).then(function(self) {
            self.echo(self.evaluate(countLinks) + ' links');
        });
    }
];

casper.start().then(function(self) {
    self.echo('Starting');
});

var currentSuite = 0;

function check(self) {
    if (suites[currentSuite]) {
        suites[currentSuite](casper);
        currentSuite++;
        casper.run(check);
    } else {
        self.echo('All done.').exit();
    }
}

casper.run(check);
