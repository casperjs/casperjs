/*jshint strict:false*/
/*global kasperError console phantom require*/

var kasper = require("kasper").create();

// listening to a custom event
kasper.on("google.loaded", function(title) {
    this.echo("Google page title is " + title);
});

kasper.start("http://google.com/", function() {
    // emitting a custom event
    this.emit("google.loaded", this.getTitle());
});

kasper.run();
