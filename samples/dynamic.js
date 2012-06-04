var casper = require("casper").create({
    verbose: true
});

// If we don't set a limit, it could go on forever
var upTo = ~~casper.cli.get(0) || 10;

/*
Fetch all <a> elements from the page and return
the ones which contains a href starting with 'http://'
*/
var searchLinks = function() {
    var filter, map;
    filter = Array.prototype.filter;
    map = Array.prototype.map;
    return map.call(filter.call(document.querySelectorAll("a"), function(a) {
        return /^http:\/\/.*/i.test(a.getAttribute("href"));
    }), function(a) {
        return a.getAttribute("href");
    });
};

// The base links array
var links = [
    "http://google.com/",
    "http://yahoo.com/",
    "http://bing.com/"
];

// Just opens the page and prints the title
var start = function(link) {
    this.start(link, function() {
        this.echo('Page title: ' + this.getTitle());
    });
};

// Get the links, and add them to the links array
// (It could be done all in one step, but it is intentionally splitted)
var addLinks = function(link) {
    this.then(function() {
        var found = this.evaluate(searchLinks);
        this.echo(found.length + " links found on " + link);
        links = links.concat(found);
    });
};

casper.start();

casper.then(function() {
    this.echo("Starting");
});

var currentLink = 0;

// As long as it has a next link, and is under the maximum limit, will keep running
function check() {
    if (links[currentLink] && currentLink < upTo) {
        this.echo('--- Link ' + currentLink + ' ---');
        start.call(this, links[currentLink]);
        addLinks.call(this, links[currentLink]);
        currentLink++;
        this.run(check);
    } else {
        this.echo("All done.");
        this.exit();
    }
};

casper.run(check);
