/*eslint strict:0*/
var fs = require("fs");

casper.test.begin("Casper.getPageContent() text/html content", 1, function(test) {
    casper.start("tests/site/test.html");
    casper.waitForUrl("tests/site/test.html", function() {
        test.assertMatch(this.getPageContent(), /<title>CasperJS test target/,
                         "Casper.getPageContent() retrieves text/html content");
    });
    casper.run(function() {
        test.done();
    });
});

casper.test.begin("Casper.getPageContent() non text/html content", 2, function(test) {
    // NOTE due to a bug in slimerjs we can only use text/* and
    // application/json content here
    // https://github.com/laurentj/slimerjs/issues/405
    casper.start("tests/site/dummy.json");
    casper.waitForUrl("tests/site/dummy.json", function() {
        test.assertEquals(this.getPageContent(), '{"dummy":"json"}\n',
                          "Casper.getPageContent() retrieves application/json content");
    });
    casper.thenOpen("tests/site/dummy.txt");
    casper.waitForUrl("tests/site/dummy.txt", function() {
        test.assertEquals(this.getPageContent(), 'some dummy text\n',
                          "Casper.getPageContent() retrieves text/plain content");
    });

    casper.run(function() {
        test.done();
    });
});
