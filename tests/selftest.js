/**
 * CasperJS local HTTP test server
 */

/*global phantom casper require*/

var colorizer = require('colorizer').create('Colorizer');
var fs = require('fs');
var utils = require('utils');
var server = require('webserver').create();
var service;
var testServerPort = 54321;

function info(message) {
    "use strict";
    console.log(colorizer.colorize('INFO', 'INFO_BAR') + ' ' + message);
}

service = server.listen(testServerPort, function(request, response) {
    "use strict";
    var pageFile = fs.pathJoin(phantom.casperPath, request.url);
    if (!fs.exists(pageFile) || !fs.isFile(pageFile)) {
        response.statusCode = 404;
        response.write("404 - NOT FOUND");
    } else {
        response.statusCode = 200;
        response.write(fs.read(pageFile));
    }
    response.close();
});

// overriding Casper.open to prefix all test urls
casper.setFilter('open.location', function(location) {
    "use strict";
    if (/^file/.test(location)) {
        return location;
    }
    if (!/^http/.test(location)) {
        return utils.format('http://localhost:%d/%s', testServerPort, location);
    }
    return location;
});

// test suites completion listener
casper.test.on('tests.complete', function() {
    "use strict";
    server.close();
});
