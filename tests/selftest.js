
var require = patchRequire(require);
var colorizer = require('colorizer').create('Colorizer');
var fs = require('fs');
var utils = require('utils');
var server = require('webserver').create();
var service;
var testServerPort = 54321;

var contentTypes = {
    html: {type: 'text/html', binMode: false},
    js: {type: 'application/javascript', binMode: false},
    json: {type: 'application/json', binMode: false},
    txt: {type: 'text/plain', binMode: false},
    png: {type: 'image/png', binMode: true},
    notype: {type: null, binMode: false},
    _default: {type: 'application/octet-stream', binMode: true}
};
var extensionRE = /\.([a-zA-Z]*)$/;

function info(message) {
    "use strict";
    console.log(colorizer.colorize('INFO', 'INFO_BAR') + ' ' + message);
}

service = server.listen(testServerPort, function(request, response) {
    "use strict";
    /*eslint max-statements:0*/
    var requestPath = request.url;
    if (requestPath.indexOf('?') !== -1) {
        requestPath = request.url.split('?')[0];
    }
    var pageFile = fs.pathJoin(phantom.casperPath, requestPath);
    if (!fs.exists(pageFile) || !fs.isFile(pageFile)) {
        response.statusCode = 404;
        console.log(utils.format('Test server url not found: %s (file: %s)', request.url, pageFile), "warning");
        response.write("404 - NOT FOUND");
    } else {
        var headers = {};
        var binMode;

        var extension = extensionRE.exec(pageFile);
        extension = extension && extension[1];
        var contentType = contentTypes[extension] ||
                          contentTypes._default;

        if (contentType.type) {
            headers['Content-Type'] = contentType.type;
        }
        binMode = contentType.binMode;

        response.writeHead(200, headers);

        if (binMode) {
            response.setEncoding("binary");
            response.write(fs.read(pageFile, 'b'));
        }
        else {
            response.write(fs.read(pageFile));
        }
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
