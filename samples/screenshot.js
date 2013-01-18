/*jshint strict:false*/
/*global kasperError console phantom require*/

/**
 * This script will capture a screenshot of a twitter account page
 * Usage: $ kasperjs screenshot.coffee <twitter-account> <filename.[jpg|png|pdf]>
 */

var kasper = require("kasper").create({
    viewportSize: {
        width: 1024,
        height: 768
    }
});

var twitterAccount = kasper.cli.get(0);
var filename       = kasper.cli.get(1);

if (!twitterAccount || !filename || !/\.(png|jpg|pdf)$/i.test(filename)) {
    kasper
        .echo("Usage: $ kasperjs screenshot.coffee <twitter-account> <filename.[jpg|png|pdf]>")
        .exit(1)
    ;
}

kasper.start("https://twitter.com/#!/" + twitterAccount, function() {
    this.waitForSelector(".tweet-row", (function() {
        this.captureSelector(filename, "html");
        this.echo("Saved screenshot of " + (this.getCurrentUrl()) + " to " + filename);
    }), (function() {
        this.die("Timeout reached. Fail whale?");
        this.exit();
    }), 12000);
});

kasper.run();
