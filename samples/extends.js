var Casper = require("casper").Casper;

/**
 * Adds two new methods to the Casper prototype: fetchTexts and renderJSON.
 */
Casper.extend({
    /**
     * Adds a new navigation step for casper; basically it will:
     *
     * 1. open an url,
     * 2. on loaded, will fetch all contents retrieved through the provided
     *    CSS3 selector and return them in a formatted object.
     */
    fetchTexts: function(selector) {
        return this.evaluate(function(selector) {
            var elements = document.querySelectorAll(selector);
            return Array.prototype.map.call(elements, function(e) {
                return e.innerText;
            });
        }, { selector: selector });
    },

    /**
     * Echoes a JSON output of the fetched results and exits phantomjs.
     */
    renderJSON: function(what) {
        return this.echo(JSON.stringify(what, null, '  ')).exit();
    }
});

var casper = new Casper({
    loadImages:  false,
    loadPlugins: false,
    logLevel:    "debug",
    verbose:     true
});

var articles = [];

casper.start('http://www.liberation.fr/', function() {
    articles = this.fetchTexts('h3');
});

casper.thenOpen('http://www.lemonde.fr/', function() {
    articles.concat(this.fetchTexts('h2.article'));
});

casper.run(function(self) {
    self.renderJSON(articles);
});
