/*jshint strict:false*/
/*global kasperError console phantom require*/

/**
 * Just a silly game.
 *
 * $ kasperjs samples/timeout.js 500
 * Will google.com load in less than 500ms?
 * NOPE.
 *
 * $ kasperjs samples/timeout.js 1000
 * Will google.com load in less than 1000ms?
 * NOPE.
 *
 * $ kasperjs samples/timeout.js 1500
 * Will google.com load in less than 1500ms?
 * NOPE.
 *
 * $ kasperjs samples/timeout.js 2000
 * Will google.com load in less than 2000ms?
 * YES!
 */

var kasper = require("kasper").create({
    onTimeout: function() {
        this
            .echo("NOPE.", "RED_BAR")
            .exit()
        ;
    }
});

var timeout = ~~kasper.cli.get(0);

if (timeout < 1) {
    kasper
        .echo("You must pass a valid timeout value")
        .exit(1)
    ;
}

kasper.echo("Will google.com load in less than " + timeout + "ms?");
kasper.options.timeout = timeout;

kasper.start("http://www.google.com/", function() {
    this.echo("YES!", "GREEN_BAR");
    this.exit();
});

kasper.run();
