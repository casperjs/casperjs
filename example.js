phantom.injectJs('casper.js');

function q() {
    document.querySelector('input[name="q"]').setAttribute('value', '%term%');
    document.querySelector('form[name="f"]').submit();
}

function getLinks() {
    return Array.prototype.map.call(document.querySelectorAll('h3.r a'), function(e) {
        return e.getAttribute('href');
    });
}

var links = [];
var casper = new phantom.Casper({
    logLevel: "info",
    verbose: true
})
    .start('http://google.fr/')
    .thenEvaluate(q, {
        term: 'casper',
    })
    .then(function(self) {
        links = self.evaluate(getLinks);
    })
    .thenEvaluate(q, {
        term: 'homer',
    })
    .then(function(self) {
        links = links.concat(self.evaluate(getLinks));
    })
    .run(function(self) {
        self.echo(JSON.stringify({
            result: self.result,
            links: links
        }, null, '  '));
        self.exit();
    })
;
