var casper = require('casper').create({
    verbose: true
});

function countLinks() {
    return document.querySelectorAll('a').length;
}

var suites = [
    function() {
        this.echo('Suite 1');
        this.start('http://google.com/', function() {
            this.echo('Page title: ' + this.getTitle());
        }).then(function() {
            this.echo(this.evaluate(countLinks) + ' links');
        });
    },
    function() {
        this.echo('Suite 2');
        this.start('http://yahoo.com/', function() {
            this.echo('Page title: ' + this.getTitle());
        }).then(function() {
            this.echo(this.evaluate(countLinks) + ' links');
        });
    },
    function() {
        this.echo('Suite 3');
        this.start('http://bing.com/', function() {
            this.echo('Page title: ' + this.getTitle());
        }).then(function() {
            this.echo(this.evaluate(countLinks) + ' links');
        });
    }
];

casper.start().then(function() {
    this.echo('Starting');
});

var currentSuite = 0;

function check() {
    if (suites[currentSuite]) {
        suites[currentSuite].call(this);
        currentSuite++;
        casper.run(check);
    } else {
        this.echo('All done.').exit();
    }
}

casper.run(check);
