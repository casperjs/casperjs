/*global casper*/
/*jshint strict:false*/
var currentRequest, utils = require("utils");

function onResourceRequested(requestData, request) {
    currentRequest = requestData;
}

function testHeader(header) {
    return header.name === 'Accept' && header.value === 'application/json';
}

casper.test.begin('requests tests', 3, {
    setUp: function() {
        casper.on('page.resource.requested', onResourceRequested);
    },

    tearDown: function() {
        currentRequest = undefined;
        casper.removeListener('page.resource.requested', onResourceRequested);
    },

    test: function(test) {
        casper.start('tests/site/index.html', function() {
            test.assertNot(currentRequest.headers.some(testHeader),
                "Casper.open() sets no custom header by default");
        });

        casper.thenOpen('tests/site/index.html', {
            headers: {
                Accept: 'application/json'
            }
        }, function() {
            test.assert(currentRequest.headers.some(testHeader),
                "Casper.open() can set a custom header");
        });

        casper.thenOpen('tests/site/index.html', function() {
            test.assertNot(currentRequest.headers.some(testHeader),
                "Casper.open() custom headers option is not persistent");
        });

        casper.run(function() {
            this.removeAllListeners('page.resource.requested');
            test.done();
        });
    }
});

// from request.coffee

var CHANGED_URL, ORIGINAL_URL, SERVER, onResourceReceived, onResourceReceivedWithChangeURL, onResourceRequested, onResourceRequestedWithAbort, onResourceRequestedWithChangeURL, requestURLReceived, requestURLRequested, setToTrueOnResourceReceived, setToTrueOnResourceRequested, setUp, setUpWithAbort, setUpWithChangeURL, tearDown, utils;

utils = require("utils");

SERVER = 'http://localhost:54321/';
ORIGINAL_URL = "tests/site/index.html";
CHANGED_URL = "tests/site/index.html?foo=bar";
setToTrueOnResourceRequested = false;
setToTrueOnResourceReceived = false;
requestURLRequested = '';
requestURLReceived = '';
onResourceRequested = function(casper, requestData, request) {
if (requestData.url === (SERVER + ORIGINAL_URL)) {
  setToTrueOnResourceRequested = true;
  return requestURLRequested = requestData.url;
}
};
onResourceRequestedWithAbort = function(casper, requestData, request) {
if (requestData.url === (SERVER + ORIGINAL_URL)) {
  return request.abort();
}
};
onResourceRequestedWithChangeURL = function(casper, requestData, request) {
if (requestData.url === (SERVER + ORIGINAL_URL)) {
  return request.changeUrl(SERVER + CHANGED_URL);
}
};
onResourceReceived = function(casper, response) {
if (response.url === (SERVER + ORIGINAL_URL)) {
  setToTrueOnResourceReceived = true;
  return requestURLReceived = response.url;
}
};
onResourceReceivedWithChangeURL = function(casper, response) {
if (response.url === (SERVER + CHANGED_URL)) {
  return requestURLReceived = response.url;
}
};
setUp = function(test) {
casper.options.onResourceRequested = onResourceRequested;
casper.options.onResourceReceived = onResourceReceived;
return casper.start();
};
setUpWithAbort = function(test) {
casper.options.onResourceRequested = onResourceRequestedWithAbort;
casper.options.onResourceReceived = onResourceReceived;
return casper.start();
};
setUpWithChangeURL = function(test) {
casper.options.onResourceRequested = onResourceRequestedWithChangeURL;
casper.options.onResourceReceived = onResourceReceivedWithChangeURL;
return casper.start();
};
tearDown = function(test) {
setToTrueOnResourceRequested = false;
setToTrueOnResourceReceived = false;
casper.options.onResourceRequested = null;
return casper.options.onResourceReceived = null;
};

casper.test.begin("onResourceRequested tests without abort/override", 4, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
      casper.open(ORIGINAL_URL).then(function() {});
      casper.wait(200, function() {
        test.assertEquals(setToTrueOnResourceRequested, true, "Casper.options.onResourceRequested called successfully");
        test.assertEquals(requestURLRequested, SERVER + ORIGINAL_URL, "request url successfully recorded");
        test.assertEquals(setToTrueOnResourceReceived, true, "Casper.options.onResourceReceived called successfully");
        return test.assertEquals(requestURLReceived, SERVER + ORIGINAL_URL, "response url successfully recorded");
      });
      return casper.run(function() {
        return test.done();
      });
    }
});
casper.test.begin("onResourceRequested tests with request.abort()", 1, {
    setUp: setUpWithAbort,
    tearDown: tearDown,
    test: function(test) {
      casper.open(ORIGINAL_URL).then(function() {});
      casper.wait(200, function() {
        return test.assertNotEquals(setToTrueOnResourceReceived, true, "Casper.options.onResourceReceived correctly never called");
      });
      return casper.run(function() {
        return test.done();
      });
    }
});
casper.test.begin("onResourceRequested tests with request.changeUrl()", 1, {
    setUp: setUpWithChangeURL,
    tearDown: tearDown,
    test: function(test) {
      casper.open(ORIGINAL_URL).then(function() {});
      casper.wait(200, function() {
        return test.assertEquals(requestURLReceived, SERVER + CHANGED_URL, "response url successfully changed");
      });
      return casper.run(function() {
        return test.done();
      });
    }
});