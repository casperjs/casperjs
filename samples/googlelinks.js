phantom.injectJs('casper.js');

function getLinks() {
    var links = document.querySelectorAll('h3.r a');
    return Array.prototype.map.call(links, function(e) {
        return {
            title: e.innerText,
            href:  e.getAttribute('href')
        };
    });
}

var links = [];
var casper = new phantom.Casper({
    logLevel: "debug",
    loadImages: false,
    loadPlugins: false,
    verbose: true
})
    .start('http://google.fr/')
    .then(function(self) {
        // search for 'casperjs' from google form
        self.fill('form[name=f]', {
            q: 'casperjs'
        }, true);
    })
    .then(function(self) {
        // aggregate results for the 'casperjs' search
        links = self.evaluate(getLinks);
        // now search for 'phantomjs' by fillin the form again
        self.fill('form[name=f]', {
            q: 'phantomjs'
        }, true);
    })
    .then(function(self) {
        // aggregate results for the 'phantomjs' search
        links = links.concat(self.evaluate(getLinks));
    })
    .run(function(self) {
        // echo results in some pretty fashion
        self.echo(links.map(function(i) {
            return i.title + ' (' + i.href + ')';
        }).join('\n')).exit();
    })
;
