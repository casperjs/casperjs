/*global casper*/
/*jshint strict:false*/
/* jshint -W100 */
casper.test.begin('event page.resource.requested tests', 4, function (test) {

    var pageResourceRequested = false;
    var pageResourceReceived = false;

    casper.on('page.resource.requested', function () {
        pageResourceRequested = true;
    });
    casper.on('page.resource.received', function () {
        pageResourceReceived = true;
    });

    casper.start('tests/site/urls.html', function () {
        rawUnicodeUrlTest();
    });

    var rawUnicodeUrlTest = function () {
        casper.waitFor(function () {
            return pageResourceRequested === true
        }, function () {
            casper.test.pass('page.resource.requested called on raw unicode url');
        }, function () {
            casper.test.fail('page.resource.requested was not called on raw unicode url')
        }, 200);

        casper.waitFor(function () {
            return pageResourceReceived === true
        }, function () {
            casper.test.pass('page.resource.received called on raw unicode url');
            uriEncodedUrlTest();
        }, function () {
            casper.test.fail('page.resource.received was not called on raw unicode url')
        }, 200);

        pageResourceRequested = false;
        pageResourceReceived = false;

        casper.clickLabel('raw unicode', 'a');
    };

    var uriEncodedUrlTest = function () {
        casper.waitFor(function () {
            return pageResourceRequested === true
        }, function () {
            casper.test.pass('page.resource.requested called on uri encoded url');
        }, function () {
            casper.test.fail('page.resource.requested was not called on uri encoded url')
        }, 200);

        casper.waitFor(function () {
            return pageResourceReceived === true
        }, function () {
            casper.test.pass('page.resource.received called on uri encoded url');
            // This test fails because of PhantomJS bug
            //escapedUrlTest();
        }, function () {
            casper.test.fail('page.resource.received was not called on uri encoded url')
        }, 200);

        pageResourceRequested = false;
        pageResourceReceived = false;

        casper.clickLabel('uri encoded', 'a');
    };

    // this test fails, because page.onNavigationRequested event get not correctly escaped url from PhantomJS:
    // console.log(casper.requestUrl) -> http://localhost:54321/tests/site/urls.html?test=Forl�
    // Chrome and Firefox do not escape this URL at all (/urls.html?test=Forl%EC)
    // We could unescape it, but it will still not be equal equal with the PhantomJS one
    // console.log(unescape(requestData.url)) -> http://localhost:54321/tests/site/urls.html?test=Forlì
    var escapedUrlTest = function () {
        casper.waitFor(function () {
            return pageResourceRequested === true
        }, function () {
            casper.test.pass('page.resource.requested called on escaped url');
        }, function () {
            casper.test.fail('page.resource.requested was not called on escaped url')
        }, 200);

        casper.waitFor(function () {
            return pageResourceReceived === true
        }, function () {
            casper.test.pass('page.resource.received called on escaped url');
        }, function () {
            casper.test.fail('page.resource.received was not called on escaped url')
        }, 200);

        pageResourceRequested = false;
        pageResourceReceived = false;

        casper.clickLabel('escaped', 'a');
    };

    casper.run(function () {
        test.done();
    });
});

