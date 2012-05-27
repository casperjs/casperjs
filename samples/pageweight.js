/**
 * Check out sizes of resources loaded on a given web page.
 *
 * Usage:
 *    $ casperjs samples/pageweight.js <url>
 */
var casper = require('casper').create();
var size = 0;

function kb(size) {
    return Math.round(size / 1024 * 100) / 100;
}

casper.on('resource.received', function(r) {
    if (r.stage !== "end") {
        return;
    }
    var rSize;
    r.headers.forEach(function(h) {
                console.log(h.name);
            });
    if (r.bodySize) {
        rSize = ~~r.bodySize;
    } else {
        try {
            rSize = ~~r.headers.filter(function(h) {
                return h.name.toLowerCase() === "content-length";
            }).pop().value;
        } catch (e) {
            // try actual content length
            if (this.getCurrentUrl() === r.url) {
                rSize = casper.page.content.length;
            }
        }
    }
    this.echo(r.url + ': ' + rSize);
    size += rSize || 0;
});

casper.on('load.finished', function(status) {
    this.echo('Total: ' + kb(size) + 'KB').exit();
});

casper.start(casper.cli.get(0));

casper.run(function() {

});
