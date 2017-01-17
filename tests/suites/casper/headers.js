/*eslint strict:0*/
var server = require('webserver').create();
var service = server.listen(8090, function(request, response) {
    response.statusCode = 200;
    response.headers = {
        'Content-Language': 'en',
        'Content-Type': 'text/html',
        'Date': new Date().toUTCString()
    };
    if (request.url.indexOf('popup') === -1) {
        response.write("ok " + request.headers["User-Agent"] );
    } else {
response.write('<!DOCTYPE html>' +
'<html>' +
'    <head>' +
'        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
'        <title>CasperJS test popup</title>' +
'    </head>' +
'    <body>' +
'        <a href="/tests/site/redirect.html" target="form">new window</a>' +
'        <a href="#" class="close", onclick="w && w.close();return false">close</a>' +
'        <script>' +
'        var w;' +
'        setTimeout(function() {' +
'            w = window.open("index.html",' +
'                            "popup", "menubar=no, status=no, scrollbars=no, menubar=no, width=400, height=300");' +
'        }, 200);' +
'        </script>' +
'    </body>' +
'</html>');
    }

    response.close();
});

casper.test.begin('Casper.headers.get() using file protocol', 1, function(test) {
    casper.start('file://' + phantom.casperPath + 'tests/site/index.html', function(response) {
        test.assertEquals(response, {data: null}, 'Empty http response on local page');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('Casper.headers.get() using http protocol', 3, function(test) {
    casper.start('http://localhost:8090/', function(response) {
        var headers = response.headers;
        test.assertEquals(headers.get('Content-Language'), 'en', 'Checking existing header (case sensitive)');
        test.assertEquals(headers.get('content-language'), 'en', 'Checking existing header (case insensitive)');
        test.assertEquals(headers.get('X-Is-Troll'), null, 'Checking unexisting header');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('Casper.headers.check() checks useraagent in popup', 1, function(test) {
    casper.userAgent('ploop').start('http://localhost:8090/popup', function(response) {
        var headers = response.headers;
        casper.waitForPopup('index.html', function() {
            casper.withPopup('index.html', function(){
                    test.assertMatch(casper.getPlainText(),/ploop/,'user-agent updated in popup request');
            });
        });
    }).run(function() {
        server.close();
        test.done();
    });
});
