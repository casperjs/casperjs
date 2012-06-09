function testUA(ua, match) {
    casper.test.assertMatch(
        ua, match, 'Default user agent matches ' + match
    );
}

testUA(casper.options.pageSettings.userAgent, /CasperJS/);

casper.start().userAgent('plop').on('resource.requested', function(request) {
    testUA(request.headers.filter(function(header) {
        return header.name === "User-Agent";
    }).pop().value, /plop/);
}).start('tests/site/index.html').run(function() {
    this.test.done();
});
