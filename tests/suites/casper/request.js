/*global casper*/
/*jshint strict:false*/
function testHeader(header) {
    return header.name === 'Accept' && header.value === 'application/json';
}

casper.test.begin('requests tests', 3, function(test) {
    var current = 0,
        tests = [
            function(request) {
                test.assertNot(request.headers.some(testHeader),
                    "Casper.open() sets no custom header by default");
            },
            function(request) {
                test.assert(request.headers.some(testHeader),
                    "Casper.open() can set a custom header");
            },
            function(request) {
                test.assertNot(request.headers.some(testHeader),
                    "Casper.open() custom headers option is not persistent");
            }
        ];

    casper.on('page.resource.requested', function(request) {
        tests[current++](request);
    });

    casper.start('tests/site/index.html');

    casper.thenOpen('tests/site/index.html', {
        headers: {
            Accept: 'application/json'
        }
    });

    casper.thenOpen('tests/site/index.html');

    casper.run(function() {
        this.removeAllListeners('page.resource.requested');
        test.done();
    });
});
