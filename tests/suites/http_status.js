/*global casper*/
/*jshint strict:false*/
/**
 * Special test server to test for HTTP status codes
 *
 */
var fs = require('fs');
var utils = require('utils');

casper.test.begin("HTTP status code handling", 163, {
    setUp: function(test) {
        this.server = require('webserver').create();
        this.server.listen(8090, function (request, response) {
            response.statusCode = parseInt(/^\/(\d+)$/.exec(request.url)[1], 10);
            response.write("");
            response.close();
        });
        this.testCodes = [
            100, 101, 102, 118, 200, 201, 202, 203, 204, 205, 206, 207, 210,
            300, 301, 302, 303, 304, 305, 307, 310
        ];
        if (utils.ltVersion(phantom.version, '1.9.0')) {
            // https://github.com/ariya/phantomjs/issues/11163
            this.testCodes = this.testCodes.concat([
                400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413,
                     414, 415, 416, 417, 418, 422, 423, 424, 425, 426, 449, 450,
                500, 501, 502, 503, 504, 505, 507, 509
            ]);
        } else {
            test.skip(102);
        }
    },

    tearDown: function() {
        this.server.close();
    },

    test: function(test) {
        casper.start();

        // file protocol
        casper.thenOpen('file://' + phantom.casperPath + '/tests/site/index.html', function() {
            this.test.assertHttpStatus(null, 'file:// protocol does not set a HTTP status');
        });

        casper.each(this.testCodes, function(self, code) {
            if (code === 100) {
                // HTTP 100 is CONTINUE, so don't expect a terminated response
                return;
            }
            this.thenOpen('http://localhost:8090/' + code, function(resource) {
                test.assertEquals(resource.status, code,
                    'Status is stored in resource.status');
                test.assertEquals(this.currentHTTPStatus, code,
                    'Status is stored in casper.currentHTTPStatus');
                test.assertHttpStatus(code, utils.format('HTTP %d handled' , code));
            });
        });

        casper.run(function() {
            this.test.done();
        });
    }
});
