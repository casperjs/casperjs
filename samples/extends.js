var articles = [];
var CasperClass = require('casper').Casper;

/**
 * Adds two new methods to the Casper prototype: fetchTexts and renderJSON.
 */
CasperClass.extend({
    /**
     * Adds a new navigation step for casper; basically it will:
     *
     * 1. open an url,
     * 2. on loaded, will fetch all contents retrieved through the provided
     *    CSS3 selector and return them in a formatted object.
     */
    fetchTexts: function(location, selector) {
        return this.thenOpen(location, function(self) {
            var texts = self.evaluate(function(selector) {
                var elements = document.querySelectorAll(selector);
                return Array.prototype.map.call(elements, function(e) {
                    return e.innerText;
                });
            }, { selector: selector });
            articles = articles.concat(texts);
        });
    },

    /**
     * Echoes a JSON output of the fetched results and exits phantomjs.
     */
    renderJSON: function(what) {
        return this.echo(JSON.stringify(what, null, '  ')).exit();
    }
});

var casper = new CasperClass({
    loadImages:  false,
    loadPlugins: false,
    logLevel:    "debug",
    verbose:     true
});

casper.start();

// all article titles are stored in <h3>
casper.fetchTexts('http://www.liberation.fr/', 'h3');

// all article titles are stored in <h2 class="article">
casper.fetchTexts('http://www.lemonde.fr/', 'h2.article');

casper.run(function(self) {
    self.renderJSON(articles);
});
