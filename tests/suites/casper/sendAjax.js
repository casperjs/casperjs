/*eslint strict:0*/
/*global CasperError, casper, console, phantom, require*/
var server = null;
var requestReceived = null;

casper.test.begin("__utils__.sendAJAX() POST Custom Headers tests", 8, {
    setUp: function() {
        server = require('webserver').create();
        server.listen('127.0.0.1:8585', function (request, response) {
            response.statusCode = 200;
            response.setHeader('Content-type', 'text/html');
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.write('<html><body>Hello!</body></html>');
            response.close();
            requestReceived = JSON.parse(JSON.stringify(request));
        });
    },
    tearDown: function() {
        server.close();
        requestReceived = null;
    },
    test: function(test) {
        var wsurl = 'http://127.0.0.1:8585';
        casper.userAgent("Googlebot/2.1 (+http://www.google.com/bot.html)");
        casper.start('tests/site/index.html').then(function() {
            this.evaluate(function(url) {
                var customData = {
                    requestData: "dummydata"
                };
                var customSettings = {
                    headers: {
                        Accept: "*/*",
                        "Accept-Language": "pt-BR,en,*",
                        "Content-Type": "multipart/form-data",
                        Host: "192.168.0.2:8584",
                        Origin: "http://google.com"
                        /* For security reasons, you may not set any header you like here.
                        See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
                             https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
                             https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_response_header_name
                        */
                    }
                };
                return __utils__.sendAJAX(url, 'POST', customData, true, customSettings);
            }, wsurl);
        }).then(function(){
            casper.waitFor(function(){
                return requestReceived !== null;
            });
        }).then(function(){
            test.assertEquals(requestReceived.method, "POST",
                "AJAX POST Request has been received!");
            test.assertEquals(requestReceived.post, "requestData=dummydata",
                "Data from AJAX POST Request has been received!");
            test.assertEquals(requestReceived.headers["User-Agent"],
                "Googlebot/2.1 (+http://www.google.com/bot.html)",
                "User-Agent is set! Server thinks we're a googlebot!");
            test.assertEquals(requestReceived.headers.Accept, "*/*",
                "Accept header is set! We're going to accept anything!");
            test.assertEquals(requestReceived.headers["Accept-Language"], "pt-BR,en,*",
                "Accept-Language is set! Server is now talking Portuguese!");
            test.assertEquals(requestReceived.headers["Content-Type"], "multipart/form-data",
                "Content-Type is set! Server is now expecting to receive a form!");
            test.assertEquals(requestReceived.headers.Host, "127.0.0.1:8585",
                "Host is set! Arbitary IP was given to the server!");
            test.assertNotEquals(requestReceived.headers.Origin, "127.0.0.1:8585",
                "Origin is set! Server accepts connection from different origin!");
        });

        casper.run(function() {
            this.test.done();
        });
    }
});
