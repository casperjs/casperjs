/*
Capture multiple pages of google search results

Usage: $ casperjs googlepagination.coffee my search terms

(all arguments will be used as the query)
*/

var casper = require("casper").create();

var currentPage = 1;

if (casper.cli.args.length === 0) {
    casper
        .echo("Usage: $ casperjs googlepagination.coffee my search terms")
        .exit(1)
    ;
}

var processPage = function processPage() {
    var url;
    this.echo("capturing page " + currentPage);
    this.capture("google-results-p" + currentPage + ".png");
    if (currentPage >= 5) {
        return;
    }
    if (this.exists("#pnnext")) {
        currentPage++;
        this.echo("requesting next page: " + currentPage);
        url = this.getCurrentUrl();
        return this.thenClick("#pnnext").then(function() {
            return this.waitFor(function() {
                return url !== this.getCurrentUrl();
            }, processPage);
        });
    } else {
        return this.echo("that's all, folks.");
    }
};

casper.start("http://google.fr/", function() {
    return this.fill('form[action="/search"]', {
        q: casper.cli.args.join(' ')
    }, true);
});

casper.then(processPage);

casper.run();
