/*jshint strict:false*/
/*global kasperError console phantom require*/

var kasper = require("kasper").create({
    verbose: true,
    logLevel: "debug"
});

kasper.log("this is a debug message", "debug");
kasper.log("and an informative one", "info");
kasper.log("and a warning", "warning");
kasper.log("and an error", "error");

kasper.exit();
