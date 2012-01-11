var t = casper.test, current = 0, tests = [
    function(settings) {
        t.assertEquals(settings, {
            method: "get"
        }, "Casper.open() used the expected GET settings");
    },
    function(settings) {
        t.assertEquals(settings, {
            method: "post",
            data:   "plop=42&chuck=norris"
        }, "Casper.open() used the expected POST settings");
    },
    function(settings) {
        t.assertEquals(settings, {
            method: "put",
            data:   "plop=42&chuck=norris"
        }, "Casper.open() used the expected PUT settings");
    },
    function(settings) {
        t.assertEquals(settings, {
            method: "get",
            username: 'bob',
            password: 'sinclar'
        }, "Casper.open() used the expected HTTP auth settings");
    }
];

casper.start();

casper.on('open', function(url, settings) {
    tests[current++](settings);
});

// GET
casper.open('tests/site/index.html').then(function() {
    t.pass("Casper.open() can open and load a location using GET");
});

// POST
casper.open('tests/site/index.html', {
    method: 'post',
    data:   {
        plop: 42,
        chuck: 'norris'
    }
}).then(function() {
    t.pass("Casper.open() can open and load a location using POST");
});

// PUT
casper.open('tests/site/index.html', {
    method: 'put',
    data:   {
        plop: 42,
        chuck: 'norris'
    }
}).then(function() {
    t.pass("Casper.open() can open and load a location using PUT");
});

// HTTP Auth
casper.open('tests/site/index.html', {
    method: 'get',
    username: 'bob',
    password: 'sinclar'
}).then(function() {
    t.pass("Casper.open() can open and load a location using HTTP auth");
});

casper.run(function() {
    this.removeAllListeners('open');
    t.done();
});
