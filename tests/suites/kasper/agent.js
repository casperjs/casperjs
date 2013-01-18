/*global kasper*/
/*jshint strict:false*/
function testUA(ua, match) {
    kasper.test.assertMatch(
        ua, match, 'Default user agent matches ' + match
    );
}

function fetchUA(request) {
    testUA(request.headers.filter(function(header) {
        return header.name === "User-Agent";
    }).pop().value, /plop/);
}

kasper.test.begin('userAgent() tests', 2, function(test) {
    testUA(kasper.options.pageSettings.userAgent, /kasperJS/);
    kasper.start();
    kasper.userAgent('plop').once('resource.requested', fetchUA);
    kasper.thenOpen('tests/site/index.html');
    kasper.run(function() {
        test.done();
    });
});
