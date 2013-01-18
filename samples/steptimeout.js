/*jshint strict:false*/
/*global kasperError console phantom require*/

var failed = [];
var start = null;
var links = [
    "http://google.com/'",
    "http://akei.com/'",
    "http://lemonde.fr/'",
    "http://liberation.fr/'",
    "http://cdiscount.fr/"
];

var kasper = require("kasper").create({
    onStepTimeout: function() {
        failed.push(this.requestUrl);
        this.test.fail(this.requestUrl + " loads in less than " + timeout + "ms.");
    }
});

kasper.on("load.finished", function() {
    this.echo(this.requestUrl + " loaded in " + (new Date() - start) + "ms", "PARAMETER");
});

var timeout = ~~kasper.cli.get(0);
kasper.options.stepTimeout = timeout > 0 ? timeout : 1000;

kasper.echo("Testing with timeout=" + kasper.options.stepTimeout + "ms, please be patient.");

kasper.start();

kasper.each(links, function(kasper, link) {
    this.then(function() {
        this.test.comment("Loading " + link);
        start = new Date();
        this.open(link);
    });
    this.then(function() {
        var message = this.requestUrl + " loads in less than " + timeout + "ms.";
        if (failed.indexOf(this.requestUrl) === -1) {
            this.test.pass(message);
        }
    });
});

kasper.run(function() {
    this.test.renderResults(true);
});
