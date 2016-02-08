/*eslint strict:0*/
var usedSettings;

function onOpen(url, settings) {
    usedSettings = settings;
}

function setUp(test) {
    casper.start().on('open', onOpen);
}

function tearDown(test) {
    usedSettings = undefined;
    casper.removeListener('open', onOpen);
}

casper.test.begin('open() GET tests', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        casper.open('tests/site/index.html').then(function() {
            test.pass("Casper.open() can open and load a location using GET");
            test.assertEquals(usedSettings, {
                method: "get"
            }, "Casper.open() used the expected GET settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin('open() GET casing tests', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        casper.open('tests/site/index.html', {
          method: 'GET'
        }).then(function() {
            test.pass("Casper.open() can open and load a location using GET");
            test.assertEquals(usedSettings, {
                method: "GET"
            }, "Casper.open() used the expected GET settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin('open() (JS disabled) tests', 3, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        casper.options.pageSettings.javascriptEnabled = false;
        casper.open('tests/site/alert.html').then(function() {
            test.pass("Casper.open() can open and load a location using GET, with JS disabled");
            test.assertEquals(usedSettings, {
                method: "get"
            }, "Casper.open() used the expected GET settings");
            test.assertHttpStatus(200, "Response Code is 200");
        });

        casper.run(function() {
            test.done();
            casper.options.pageSettings.javascriptEnabled = true;
        });
    }
});

casper.test.begin('open() POST tests', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        casper.open('tests/site/index.html', {
            method: 'post',
            data:   {
                plop: 42,
                chuck: 'norris'
            }
        }).then(function() {
            test.pass("Casper.open() can open and load a location using POST");
            test.assertEquals(usedSettings, {
                method: "post",
                data:   "plop=42&chuck=norris"
            }, "Casper.open() used the expected POST settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin('open() POST casing tests', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        casper.open('tests/site/index.html', {
            method: 'POST',
            data:   {
                plop: 42,
                chuck: 'norris'
            }
        }).then(function() {
            test.pass("Casper.open() can open and load a location using POST");
            test.assertEquals(usedSettings, {
                method: "POST",
                data:   "plop=42&chuck=norris"
            }, "Casper.open() used the expected POST settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin('open() POST json object', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        casper.open('tests/site/index.html', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data:   {
                plop: 42,
                chuck: 'norris',
                john: {'Doe': 'is here'}
            }
        }).then(function() {
            test.pass("Casper.open() can POST a JSON object");
            test.assertEquals(usedSettings, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: '{"plop":42,"chuck":"norris","john":{"Doe":"is here"}}'
            }, "Casper.open() used the expected POST settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin('open() POST json object with charset info', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        casper.open('tests/site/index.html', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            data:   {
                plop: 42,
                chuck: 'norris',
                john: {'Doe': 'is here'}
            }
        }).then(function() {
            test.pass("Casper.open() can POST a JSON object");
            test.assertEquals(usedSettings, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: '{"plop":42,"chuck":"norris","john":{"Doe":"is here"}}'
            }, "Casper.open() used the expected POST settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin('open() PUT tests', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        casper.thenOpen('tests/site/index.html', {
            method: 'put',
            data:   {
                plop: 42,
                chuck: 'norris'
            }
        }).then(function() {
            test.pass("Casper.open() can open and load a location using PUT");
            test.assertEquals(usedSettings, {
                method: "put",
                data:   "plop=42&chuck=norris"
            }, "Casper.open() used the expected PUT settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin('open() PUT casing tests', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        casper.thenOpen('tests/site/index.html', {
            method: 'PUT',
            data:   {
                plop: 42,
                chuck: 'norris'
            }
        }).then(function() {
            test.pass("Casper.open() can open and load a location using PUT");
            test.assertEquals(usedSettings, {
                method: "PUT",
                data:   "plop=42&chuck=norris"
            }, "Casper.open() used the expected PUT settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin('open() PUT tests', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        // HTTP Auth
        casper.thenOpen('tests/site/index.html', {
            method: 'get',
            username: 'bob',
            password: 'sinclar'
        }).then(function() {
            test.pass("Casper.open() can open and load a location using HTTP auth");
            test.assertEquals(usedSettings, {
                method: "get",
                username: 'bob',
                password: 'sinclar'
            }, "Casper.open() used the expected HTTP auth settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin('open() PUT tests', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        // GET with thenOpen
        casper.thenOpen('tests/site/index.html').then(function() {
            test.pass("Casper.thenOpen() can open and load a location using GET");
            test.assertEquals(usedSettings, {
                method: "get"
            }, "Casper.thenOpen() used the expected GET settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin('open() PUT tests', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        // POST with thenOpen
        casper.thenOpen('tests/site/index.html', {
            method: 'post',
            data:   {
                plop: 42,
                chuck: 'norris'
            }
        }, function() {
            test.pass("Casper.thenOpen() can open and load a location using POST");
            test.assertEquals(usedSettings, {
                method: "post",
                data:   "plop=42&chuck=norris"
            }, "Casper.thenOpen() used the expected POST settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin('open() PUT tests', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        // PUT with thenOpen
        casper.thenOpen('tests/site/index.html', {
            method: 'put',
            data:   {
                plop: 42,
                chuck: 'norris'
            }
        }, function() {
            test.pass("Casper.thenOpen() can open and load a location using PUT");
            test.assertEquals(usedSettings, {
                method: "put",
                data:   "plop=42&chuck=norris"
            }, "Casper.thenOpen() used the expected PUT settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin('open() PUT tests', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        // HTTP Auth with thenOpen
        casper.thenOpen('tests/site/index.html', {
            method: 'get',
            username: 'bob',
            password: 'sinclar'
        }, function() {
            test.pass("Casper.thenOpen() can open and load a location using HTTP auth");
            test.assertEquals(usedSettings, {
                method: "get",
                username: 'bob',
                password: 'sinclar'
            }, "Casper.thenOpen() used the expected HTTP auth settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});


casper.test.begin('open() POST json object with utf8 content', 2, {
    setUp: setUp,
    tearDown: tearDown,
    test: function(test) {
        casper.open('tests/site/index.html', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            encoding: 'utf8',
            data:   {
                plop: 42,
                chuck: 'nórrïs',
                john: {'Doe': 'ïs here™€'}
            }
        }).then(function() {
            test.pass("Casper.open() can POST a JSON object");
            test.assertEquals(usedSettings, {
                method: "POST",
                encoding: 'utf8',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: '{"plop":42,"chuck":"nórrïs","john":{"Doe":"ïs here™€"}}'
            }, "Casper.open() used the expected POST settings");
        });

        casper.run(function() {
            test.done();
        });
    }
});



