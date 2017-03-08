/*eslint strict:0*/
var server = require('webserver').create();
var service = server.listen(8092, function(request, response) {
    var path = request.url.split('/');
    response.statusCode = 200;
     
    switch (path[1]){
        case "indexscript":
            response.setHeader('Content-type', 'text/html');
            response.write('<a href="/link">a link</a>');
            response.write('<form action="/form" method="POST"><input type="submit" /></form>');           
            response.write('<script src="/script"></script>');
            response.close(); 
            break;
        case "indexscript2":
            response.setHeader('Content-type', 'text/html');
            response.write('<a href="/link">a link</a>');
            response.write('<form action="/form" method="POST"><input type="submit" /></form>');           
            response.write('<script src="/script2"></script>');
            response.close(); 
            break;            
        case "form": case "link": case "":
            response.setHeader('Content-type', 'text/html');
            response.write('<a href="/link">a link</a>');
            response.write('<form action="/form" method="POST"><input type="submit" /></form>');   
            response.close();
            break;
        case "script": //never close connexion
            break;
        case "script2": //partial response never close connexion
            response.setHeader('Content-type', 'text/javascript');
            response.write('var a=2;');
            break;
        case "longScript": 
            response.setHeader('Content-type', 'text/html');
            response.write('<html><body><script>for(;;);</script></body></html>');
            response.close();
            break;
    }
});

var resourceTimeout =  function resourceTimeout (request) {
    casper.test.pass('resource.timeout matched');
};

var stopScript =  function stopScript (webpage, message) {
    webpage.stopJavaScript();
    casper.test.pass('remote.longRunningScript matched ' + message);
    return true;
};

var closeService = function closeService(message) {
    casper.test.begin(message, 0, function(test) {
        casper.start('http://localhost:8092/').run(function() {
            test.done();
            server.close();
        });
    });
};

casper.test.begin('Link Navigation updates response', 2, function(test) {
    casper.start('http://localhost:8092/', function(response) {
        casper.click('a');
        casper.then(function(response) {
            test.assertUrlMatch(
                /\/link$/,
                'URL matches anchor href'
            );
            test.assertEquals(
                response.url,
                casper.page.url,
                'response is consistent with the internal page'
            );
        });
    }).run(function() {
        test.done();
    });
});

casper.test.begin('Form Submittal updates the response', 2, function(test) {
    casper.start('http://localhost:8092/', function(response) {
        casper.fill('form', {}, true);
        casper.then(function(response) {
            test.assertUrlMatch(
                /\/form$/,
                'URL matches form action'
            );
            test.assertEquals(
                response.url,
                casper.page.url,
                'response is consistent with the internal page'
            );
        });
    }).run(function() {
        test.done();
    });
});

if (phantom.casperEngine === 'slimerjs' && utils.ltVersion(slimer.version, '0.10.0')){
    closeService('No resourceTimeout and longRunningScript functionality');
} else {
    casper.test.begin('Catch resourceTimeout on partial response', 2, function(test) {

        casper.on("resource.timeout",resourceTimeout);
        casper.page.settings.resourceTimeout = 1000;
        casper.start('http://localhost:8092/indexscript2', function(response) {
            delete casper.page.settings.resourceTimeout;
            test.pass('unable to load page on time');
            casper.removeListener("resource.timeout", resourceTimeout);
        }).run(function() {
            test.done();
        });
    });

    casper.test.begin('Catch resourceTimeout on No response', 2, function(test) {
        casper.on("resource.timeout",resourceTimeout);
        casper.page.settings.resourceTimeout = 1000;
        casper.start('http://localhost:8092/indexscript', function(response) {
            delete casper.page.settings.resourceTimeout;
            test.pass('unable to load page on time');
            casper.removeListener("resource.timeout", resourceTimeout);
        }).run(function() {
            
            test.done();
        });
    });

    if (phantom.casperEngine === 'phantomjs') {
        closeService('No longRunningScript functionality');
    } else {
        casper.test.begin('Catch longRunningScript', 2, function(test) {
            casper.on("remote.longRunningScript", stopScript);
            casper.start('http://localhost:8092/longScript', function(response) {
                test.pass('unable to load page on time because of script');
                casper.removeListener("remote.longRunningScript", stopScript);
            }).run(function() {

                test.done();
                server.close();
            });
        });
    }
}
