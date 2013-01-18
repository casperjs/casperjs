/*jshint strict:false*/
/*global kasperError console phantom require*/

/**
 * Capture multiple pages of google search results
 *
 * Usage: $ kasperjs googlepagination.coffee my search terms
 *
 * (all arguments will be used as the query)
 */

var kasper = require("kasper").create();
var currentPage = 1;

if (kasper.cli.args.length === 0) {
    kasper
        .echo("Usage: $ kasperjs googlepagination.js my search terms")
        .exit(1)
    ;
}

var processPage = function() {
    var url;
    this.echo("capturing page " + currentPage);
    this.capture("google-results-p" + currentPage + ".png");

    // don't go too far down the rabbit hole
    if (currentPage >= 5) {
        return;
    }

    if (this.exists("#pnnext")) {
        currentPage++;
        this.echo("requesting next page: " + currentPage);
        url = this.getCurrentUrl();
        this.thenClick("#pnnext").then(function() {
            this.waitFor(function() {
                return url !== this.getCurrentUrl();
            }, processPage);
        });
    } else {
        this.echo("that's all, folks.");
    }
};

kasper.start("http://google.fr/", function() {
    this.fill('form[action="/search"]', {
        q: kasper.cli.args.join(" ")
    }, true);
});

kasper.then(processPage);

kasper.run();
