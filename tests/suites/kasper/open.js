/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('open() tests', 16, function(test) {
    var current = 0,
        tests = [
            function(settings) {
                test.assertEquals(settings, {
                    method: "get"
                }, "kasper.open() used the expected GET settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "post",
                    data:   "plop=42&chuck=norris"
                }, "kasper.open() used the expected POST settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "put",
                    data:   "plop=42&chuck=norris"
                }, "kasper.open() used the expected PUT settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "get",
                    username: 'bob',
                    password: 'sinclar'
                }, "kasper.open() used the expected HTTP auth settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "get"
                }, "kasper.thenOpen() used the expected GET settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "post",
                    data:   "plop=42&chuck=norris"
                }, "kasper.thenOpen() used the expected POST settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "put",
                    data:   "plop=42&chuck=norris"
                }, "kasper.thenOpen() used the expected PUT settings");
            },
            function(settings) {
                test.assertEquals(settings, {
                    method: "get",
                    username: 'bob',
                    password: 'sinclar'
                }, "kasper.thenOpen() used the expected HTTP auth settings");
            }
        ];

    kasper.start().on('open', function(url, settings) {
        tests[current++](settings);
    });

    // GET
    kasper.open('tests/site/index.html').then(function() {
        test.pass("kasper.open() can open and load a location using GET");
    });

    // POST
    kasper.open('tests/site/index.html', {
        method: 'post',
        data:   {
            plop: 42,
            chuck: 'norris'
        }
    }).then(function() {
        test.pass("kasper.open() can open and load a location using POST");
    });

    // PUT
    kasper.open('tests/site/index.html', {
        method: 'put',
        data:   {
            plop: 42,
            chuck: 'norris'
        }
    }).then(function() {
        test.pass("kasper.open() can open and load a location using PUT");
    });

    // HTTP Auth
    kasper.open('tests/site/index.html', {
        method: 'get',
        username: 'bob',
        password: 'sinclar'
    }).then(function() {
        test.pass("kasper.open() can open and load a location using HTTP auth");
    });

    // GET with thenOpen
    kasper.thenOpen('tests/site/index.html').then(function() {
        test.pass("kasper.thenOpen() can open and load a location using GET");
    });

    // POST with thenOpen
    kasper.thenOpen('tests/site/index.html', {
        method: 'post',
        data:   {
            plop: 42,
            chuck: 'norris'
        }
    }, function() {
        test.pass("kasper.thenOpen() can open and load a location using POST");
    });

    // PUT with thenOpen
    kasper.thenOpen('tests/site/index.html', {
        method: 'put',
        data:   {
            plop: 42,
            chuck: 'norris'
        }
    }, function() {
        test.pass("kasper.thenOpen() can open and load a location using PUT");
    });

    // HTTP Auth with thenOpen
    kasper.thenOpen('tests/site/index.html', {
        method: 'get',
        username: 'bob',
        password: 'sinclar'
    }, function() {
        test.pass("kasper.thenOpen() can open and load a location using HTTP auth");
    });

    kasper.run(function() {
        this.removeAllListeners('open');
        test.done();
    });
});
