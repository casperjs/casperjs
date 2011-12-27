if (!phantom.casperLoaded) {
    console.log('This script is intended to work with CasperJS, using its executable.');
    phantom.exit(1);
}

if (phantom.casperArgs.args.length !== 1) {
    console.log('You must provide the maximum number of pages to visit');
    phantom.exit(1);
}

// If we don't set a limit, it could go on forever
var upTo = Number(phantom.casperArgs.args[0], 10);

var casper = new phantom.Casper({
    verbose: true
});

// Fetch all <a> elements from the page and return 
// the ones which contains a href starting with 'http://'
function searchLinks() {
    var filter = Array.prototype.filter,
        map = Array.prototype.map;
    return map.call(filter.call(document.querySelectorAll('a'), function (a) {
        return /^http:\/\/.*/i.test(a.getAttribute('href'));
    }), function (a) {
        return a.getAttribute('href');
    });
}

// The base links array
var links = [
    'http://google.com/',
    'http://yahoo.com/',
    'http://bing.com/'
];

// Just opens the page and prints the title
var start = function (self, link) {
    self.start(link, function (self) {
        self.echo('Page title: ' + self.getTitle());
    })
};

// Get the links, and add them to the links array
// (It could be done all in one step, but it is intentionally splitted)
var addLinks = function (self, link) {
    self.then(function(self) {
        var found = self.evaluate(searchLinks);
        self.echo(found.length + " links found on " + link);
        links = links.concat(found);
    });
};

casper.start().then(function(self) {
    self.echo('Starting');
});

var currentLink = 0;

// As long as it has a next link, and is under the maximum limit, will keep running
function check(self) {
    if (links[currentLink] && currentLink < upTo) {
        self.echo('--- Link ' + currentLink + ' ---');
        start(self, links[currentLink]);
        addLinks(self, links[currentLink]);
        currentLink++;
        self.run(check);
    } else {
        self.echo('All done.').exit();
    }
}

casper.run(check);
