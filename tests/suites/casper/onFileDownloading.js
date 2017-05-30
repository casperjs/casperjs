/*eslint strict:0*/
var fs = require('fs');
var server = require('webserver').create();
var service = server.listen(8094, function(request, response) {
    response.statusCode = 200;
    response.headers = {
        'Content-Language': 'en',
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename=fake.pdf',
        //'Content-Disposition': 'inline',
        'Date': new Date().toUTCString()
    };
    response.write(['<!DOCTYPE html>',
        '<html>',
        '    <head>',
        '        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />',
        '        <title>CasperJS test popup</title>',
        '    </head>',
        '    <body>',
        '        <a href="/tests/site/redirect.html" target="form">new window</a>',
        '        <a href="#" class="close", onclick="w && w.close();return false">close</a>',
        '        <script>',
        '        var w;',
        '        setTimeout(function() {',
        '            w = window.open("index.html",',
        '                            "popup", "menubar=no, status=no, scrollbars=no, menubar=no, width=400, height=300");',
        '        }, 200);',
        '        </script>',
        '    </body>',
        '</html>'].join("\n")
    );
    response.close();
});

casper.test.begin('fileDownload events tests', 1, function(test) {
    var browserCanDownload = false;

    if (phantom.casperEngine === 'slimerjs' && utils.gteVersion(slimer.version, '0.10.0')) {
        browserCanDownload = true;
    }

    casper.setFilter("fileDownload", function toto(url, data) {
        return data.filename;
    });

    casper.on('fileDownloadError', function(message) {
        if (!browserCanDownload) {
            test.pass('fileDownloadError() occurs because browser can\'t manage Content-Disposition');
        } else {
            test.fail('fileDownloadError() occurs : ' + message);
        }
    });

    casper.start('http://localhost:8094/');

    casper.then(function() {
        if (browserCanDownload) {
            this.waitFor(function() {
                return fs.exists("fake.pdf");
            }, function(){
                test.pass('fileDownload event occurs with browser that can manage Content-Disposition');
//                fs.remove("fake.pdf");
            });
        }
    });

    casper.run(function() {
        this.removeAllListeners('fileDownloadError');
        this.removeAllFilters('fileDownload');
        test.done();
    });
});

casper.test.begin('fileDownload events tests with path error', 1, function(test) {
    var error = false;

    casper.setFilter("fileDownload", function toto(url, data) {
            return fs.separator;
    });

    casper.on('fileDownloadError', function(message) {
        test.pass('fileDownloadError() occurs : ' + message );
        error = true;
    });

    casper.start('http://localhost:8094/');

    casper.then(function() {
   	casper.waitFor(function() {
          return error === true;
        },function(){},function(){
            test.fail('fileDownloadError() never occurs' );
        }); 
    });

    casper.run(function() {
        server.close();
        test.done();
    });
});



