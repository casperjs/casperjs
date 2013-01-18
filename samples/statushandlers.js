/*jshint strict:false*/
/*global kasperError console phantom require*/

/**
 * This script will add a custom HTTP status code handler, here for 404 pages.
 */

var kasper = require("kasper").create({
    httpStatusHandlers: {
        404: function(self, resource) {
            this.echo("Resource at " + resource.url + " not found (404)", "COMMENT");
        }
    },
    verbose: true
});

kasper.start("http://www.google.com/plop", function() {
    this.echo("Done.");
    this.exit();
});

kasper.run();
