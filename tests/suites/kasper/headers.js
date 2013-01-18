/*global kasper*/
/*jshint strict:false*/
var server = require('webserver').create();
var service = server.listen(8090, function(request, response) {
    response.statusCode = 200;
    response.headers = {
        'Content-Language': 'en',
        'Content-Type': 'text/html',
        'Date': new Date().toUTCString()
    };
    response.write("ok");
    response.close();
});

kasper.test.begin('kasper.headers.get() using file protocol', 1, function(test) {
    kasper.start('file://' + phantom.kasperPath + 'tests/site/index.html', function(response) {
        test.assertEquals(response, undefined, 'No response available on local page');
    }).run(function() {
        test.done();
    })
});

kasper.test.begin('kasper.headers.get() using http protocol', 3, function(test) {
    kasper.start('http://localhost:8090/', function(response) {
        var headers = response.headers;
        test.assertEquals(headers.get('Content-Language'), 'en', 'Checking existing header (case sensitive)');
        test.assertEquals(headers.get('content-language'), 'en', 'Checking existing header (case insensitive)');
        test.assertEquals(headers.get('X-Is-Troll'), null, 'Checking unexisting header');
    }).run(function() {
        server.close();
        test.done();
    })
});
