casper.test.comment('Casper.getCurrentHeader()');

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

    casper.getCurrentHeaders().forEach(function (header) {
        casper.test.comment('- ' + header.name + ': ' + header.value);
    });
}

casper.start('tests/site/index.html', function thenLocalPage () {
    this.test.assertEquals(casper.getCurrentHeader('Status'), null, 'No Status header on local page');
    this.test.assert(casper.getCurrentHeaders().length === 0, 'No headers sent back');
});

casper.thenOpen('http://localhost:8090/', function thenLocalhost () {
    this.test.assertEquals(casper.getCurrentHeader('Content-Language'), 'en', 'Checking existing header');
    this.test.assertEquals(casper.getCurrentHeader('content-language'), null, 'Checking header typecase');
    this.test.assertEquals(casper.getCurrentHeader('X-Is-Troll'), null, 'Checking unexisting header');
});

casper.run(function () {
    server.close();
    this.test.done();
});
