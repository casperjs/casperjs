/*global casper*/
/*jshint strict:false*/
casper.test.begin('open() tests', 16, function(test) {
    var current = 0,
        tests = [
            function(settings) {
                test.assertEquals(settings, {
                    method: "get"
                }, "Casper.open() used the expected GET settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "post",
                    data:   "plop=42&chuck=norris"
                }, "Casper.open() used the expected POST settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "put",
                    data:   "plop=42&chuck=norris"
                }, "Casper.open() used the expected PUT settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "get",
                    username: 'bob',
                    password: 'sinclar'
                }, "Casper.open() used the expected HTTP auth settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "get"
                }, "Casper.thenOpen() used the expected GET settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "post",
                    data:   "plop=42&chuck=norris"
                }, "Casper.thenOpen() used the expected POST settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "put",
                    data:   "plop=42&chuck=norris"
                }, "Casper.thenOpen() used the expected PUT settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "get",
                    username: 'bob',
                    password: 'sinclar'
                }, "Casper.thenOpen() used the expected HTTP auth settings");
            }
        ];

    casper.start().on('open', function(url, settings) {
        tests[current++](settings);
    });

    // GET
    casper.open('tests/site/index.html').then(function() {
        test.pass("Casper.open() can open and load a location using GET");
    });

    // POST
    casper.open('tests/site/index.html', {
        method: 'post',
        data:   {
            plop: 42,
            chuck: 'norris'
        }
    }).then(function() {
        test.pass("Casper.open() can open and load a location using POST");
    });

    // PUT
    casper.open('tests/site/index.html', {
        method: 'put',
        data:   {
            plop: 42,
            chuck: 'norris'
        }
    }).then(function() {
        test.pass("Casper.open() can open and load a location using PUT");
    });

    // HTTP Auth
    casper.open('tests/site/index.html', {
        method: 'get',
        username: 'bob',
        password: 'sinclar'
    }).then(function() {
        test.pass("Casper.open() can open and load a location using HTTP auth");
    });

    // GET with thenOpen
    casper.thenOpen('tests/site/index.html').then(function() {
        test.pass("Casper.thenOpen() can open and load a location using GET");
    });

    // POST with thenOpen
    casper.thenOpen('tests/site/index.html', {
        method: 'post',
        data:   {
            plop: 42,
            chuck: 'norris'
        }
    }, function() {
        test.pass("Casper.thenOpen() can open and load a location using POST");
    });

    // PUT with thenOpen
    casper.thenOpen('tests/site/index.html', {
        method: 'put',
        data:   {
            plop: 42,
            chuck: 'norris'
        }
    }, function() {
        test.pass("Casper.thenOpen() can open and load a location using PUT");
    });

    // HTTP Auth with thenOpen
    casper.thenOpen('tests/site/index.html', {
        method: 'get',
        username: 'bob',
        password: 'sinclar'
    }, function() {
        test.pass("Casper.thenOpen() can open and load a location using HTTP auth");
    });

    casper.run(function() {
        this.removeAllListeners('open');
        test.done();
    });
});
