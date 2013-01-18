/*jshint strict:false*/
/*global kasperError console phantom require*/

/**
 * download the google logo image onto the local filesystem
 */

var kasper = require("kasper").create();

kasper.start("http://www.google.fr/", function() {
    this.download("http://www.google.fr/images/srpr/logo3w.png", "logo.png");
});

kasper.run();
