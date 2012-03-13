var links = [];
var casper = require('casper').create();

function getLinks() {
    var links = document.querySelectorAll('h3.r a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

casper.start('http://google.fr/', function(self) {
    // search for 'casperjs' from google form
    self.fill('form[action="/search"]', { q: 'casperjs' }, true);
});

casper.then(function(self) {
    // aggregate results for the 'casperjs' search
    links = self.evaluate(getLinks);
    // now search for 'phantomjs' by fillin the form again
    self.fill('form[action="/search"]', { q: 'phantomjs' }, true);
});

casper.then(function(self) {
    // aggregate results for the 'phantomjs' search
    links = links.concat(self.evaluate(getLinks));
});

casper.run(function(self) {
    // echo results in some pretty fashion
    self.echo(links.length + ' links found:');
    self.echo(' - ' + links.join('\n - ')).exit();
});
