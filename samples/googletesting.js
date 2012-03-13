var casper = require('casper').create({
    logLevel: "debug"
});

casper.start('http://www.google.fr/', function(self) {
    self.test.assertTitle('Google', 'google homepage title is the one expected');
    self.test.assertExists('form[action="/search"]', 'main form is found');
    self.fill('form[action="/search"]', {
        q: 'foo'
    }, true);
});

casper.then(function(self) {
    self.test.assertTitle('foo - Recherche Google', 'google title is ok');
    self.test.assertUrlMatch(/q=foo/, 'search term has been submitted');
    self.test.assertEval(function() {
        return __utils__.findAll('h3.r').length >= 10;
    }, 'google search for "foo" retrieves 10 or more results');
});

casper.run(function(self) {
    self.test.renderResults(true);
});
