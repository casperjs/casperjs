/*jshint strict:false*/
/*global kasperError console phantom require*/

/**
 * A basic custom logging implementation. The idea is to (extremely) verbosely
 * log every received resource.
 */
var kasper = require("kasper").create({
    verbose: true,
    logLevel: "verbose"
});

/**
 * Every time a resource is received, a new log entry is added to the stack at
 * the 'verbose' level.
 */
kasper.on('resource.received', function(resource) {
    var infos = [];
    var props = [
        "url",
        "status",
        "statusText",
        "redirectURL",
        "bodySize"
    ];
    props.forEach(function(prop) {
        infos.push(resource[prop]);
    });
    resource.headers.forEach(function(header) {
        infos.push("[" + header.name + ": " + header.value + "]");
    });
    this.log(infos.join(", "), "verbose");
});

// add a new 'verbose' logging level at the lowest priority
kasper.logLevels = ["verbose"].concat(kasper.logLevels);

// test our new logger with google
kasper.start("http://www.google.com/").run(function() {
    this.exit();
});
