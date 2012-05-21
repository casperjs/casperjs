var casper, check, countLinks, currentSuite, suites;

casper = require("casper").create({
    verbose: true
});

countLinks = function() {
    return document.querySelectorAll('a').length;
};

suites = [
    function() {
        this.echo("Suite 1");
        this.start("http://google.com/", function() {
            this.echo("Page title: " + (this.getTitle()));
        });
        this.then(function() {
            this.echo((this.evaluate(countLinks)) + " links");
        });
    }, function() {
        this.echo("Suite 2");
        this.start("http://yahoo.com/", function() {
            this.echo("Page title: " + (this.getTitle()));
        });
        this.then(function() {
            this.echo((this.evaluate(countLinks)) + " links");
        });
    }, function() {
        this.echo("Suite 3");
        this.start("http://bing.com/", function() {
            this.echo("Page title: " + (this.getTitle()));
        });
        this.then(function() {
            this.echo((this.evaluate(countLinks)) + " links");
        });
    }
];

casper.start();

casper.then(function() {
    this.echo("Starting");
});

currentSuite = 0;

check = function() {
    if (suites[currentSuite]) {
        suites[currentSuite].call(this);
        currentSuite++;
        casper.run(check);
    } else {
        this.echo("All done.");
        this.exit();
    }
};

casper.run(check);
