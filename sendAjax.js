/*eslint strict:0*/
/**
 * Special test server to test sendAJAX function
 *
 */
var utils = require('utils');

casper.test.begin("__utils__.sendAJAX() POST Custom Headers tests", 7, {
    setUp: function(test) {
        this.server = require('webserver').create();
        this.requestReceived = null;
        this.server.listen(8585, function (request, response) {
            requestReceived = request;
            response.statusCode = 200;
            response.write("");
            response.close();
        });
    },

    tearDown: function() {
        this.server.close();
        this.requestReceived = null;
    },

    test: function(test) {
        var wsurl = 'http://127.0.0.1:8585';
        casper.userAgent("Googlebot/2.1 (+http://www.google.com/bot.html)");
        casper.start().then(function() {
            this.evaluate(function(wsurl) {
                var customData = {"requestData":"dummydata"};
                var customSettings = {
                    headers:{
                        "Accept": "*/*",
                        "Accept-Language": "pt-BR,en,*",
                        "Content-Type": "multipart/form-data",
                        "Host" : "192.168.0.2:8584",
                        "Origin": "http://google.com"
                        /* For security reasons, you may not set any header you like here.
                        See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
                             https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
                             https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_response_header_name
                        */
                        //,"User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)"
                    }
                };
                return __utils__.sendAJAX(wsurl, 'POST', customData, false, customSettings);
            }, {wsurl: wsurl})
        }).then(function(){
            test.assertEquals(requestReceived.method, "POST", "AJAX POST Request has been received!");
            test.assertEquals(requestReceived.post, "requestData=dummydata", "Data from AJAX POST Request has been received!");
            test.assertEquals(requestReceived.headers["Accept"], "*/*","Accept header is set! We're going to accept anything!");
            test.assertEquals(requestReceived.headers["Accept-Language"], "pt-BR,en,*","Accept-Language is set! Server is now talking Portuguese!");
            test.assertEquals(requestReceived.headers["Content-Type"], "multipart/form-data","Content-Type is set! Server is now expecting to receive a form!");
            test.assertEquals(requestReceived.headers["Host"], "192.168.0.2:8584","Host is set! Arbitary IP was given to the server!");
            test.assertEquals(requestReceived.headers["Origin"], "http://google.com","Origin is set! Server thinks we came from google!");
            //test.assertEquals(requestReceived.headers["User-Agent"], "Googlebot/2.1 (+http://www.google.com/bot.html)","User-Agent is set! Server thinks we're a googlebot!");
        });

        casper.run(function() {
            this.test.done();
        });
    }
});
