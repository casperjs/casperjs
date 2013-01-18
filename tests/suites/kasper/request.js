/*global kasper*/
/*jshint strict:false*/
function testHeader(header) {
    return header.name === 'Accept' && header.value === 'application/json';
}

kasper.test.begin('requests tests', 3, function(test) {
    var current = 0,
        tests = [
            function(request) {
                test.assertNot(request.headers.some(testHeader),
                    "kasper.open() sets no custom header by default");
            },
            function(request) {
                test.assert(request.headers.some(testHeader),
                    "kasper.open() can set a custom header");
            },
            function(request) {
                test.assertNot(request.headers.some(testHeader),
                    "kasper.open() custom headers option is not persistent");
            }
        ];

    kasper.on('page.resource.requested', function(request) {
        tests[current++](request);
    });

    kasper.start('tests/site/index.html');

    kasper.thenOpen('tests/site/index.html', {
        headers: {
            Accept: 'application/json'
        }
    });

    kasper.thenOpen('tests/site/index.html');

    kasper.run(function() {
        this.removeAllListeners('page.resource.requested');
        test.done();
    });
});
