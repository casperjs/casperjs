casper.test.comment('Casper.headers.get()');

var server = require('webserver').create();
var service = server.listen(8090, function (request, response) {
    response.statusCode = 200;
    response.headers = {
        'Content-Language': 'en',
        'Content-Type': 'text/html',
        'Date': new Date().toUTCString()
    };
    response.write("\o/");
    response.close();
});

function dumpHeaders () {
    casper.test.comment('Dumping current response headers');

    casper.currentResponse.headers.forEach(function (header) {
        casper.test.comment('- ' + header.name + ': ' + header.value);
    });
}

casper.start('tests/site/index.html', function thenLocalPage () {
    this.test.assertEquals(casper.currentResponse, undefined, 'No response available on local page');
});

casper.thenOpen('http://localhost:8090/', function thenLocalhost () {
    var headers = casper.currentResponse.headers;

    this.test.assertEquals(headers.get('Content-Language'), 'en', 'Checking existing header');
    this.test.assertEquals(headers.get('content-language'), null, 'Checking header typecase');
    this.test.assertEquals(headers.get('X-Is-Troll'), null, 'Checking unexisting header');
});

casper.run(function () {
    server.close();
    this.test.done();
});
