/*eslint strict:0*/
/**
 * Special test server to test for HTTP status codes
 *
 */
var fs = require('fs');

casper.test.begin('HTTP Redirect handling', 1, {
    setUp: function() {
        var pageFile = fs.pathJoin(phantom.casperPath, 'tests/site/redirect.html');

        this.server = require('webserver').create();
        this.server.listen(8090, function (request, response) {
            if (request.url === '/redirect') {
                response.statusCode = 302;
                response.setHeader('Location', '/hello');
                response.write('');
            } else {
                response.statusCode = 200;
                response.write(fs.read(pageFile));
            }
            response.close();
        });
    },

    tearDown: function() {
        this.server.close();
    },

    test: function() {
        casper.start();

        // Redirect
        casper.thenOpen('http://localhost:8090/redirect', function() {
            this.test.assert(true, 'Assert that the page has been fully loaded');
        });

        casper.run(function() {
            this.test.done();
        });
    }
});
