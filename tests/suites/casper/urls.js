/*eslint strict:0*/

casper.test.begin('urls tests', 9, function(test) {
    var assertURL = function(match, message) {
        test.assertHttpStatus(200);
        test.assertUrlMatches(match, message);
    };

    casper.start('tests/site/urls.html#fragment');

    casper.waitForUrl(/urls.html/, function() {
        assertURL('urls.html', 'Casper.start loads URL with fragment');
        test.assertEqual(casper.evaluate(function() {
            return location.hash;
        }), '#fragment', 'location.hash equals fragment');
    });

    casper.then(function() {
        this.clickLabel('raw unicode', 'a');
    });

    casper.waitForUrl(/Forlì/,
        assertURL.bind(this,
            'Forlì',
            'Casper.getCurrentUrl() retrieves a raw unicode URL'
        ));

    casper.then(function() {
        this.clickLabel('escaped', 'a');
    });

    casper.waitForUrl(/Farlì/,
        assertURL.bind(this,
            'Farlì',
            'Casper.getCurrentUrl() retrieves an escaped URL'
        ));

    casper.then(function() {
        this.clickLabel('uri encoded', 'a');
    });

    casper.waitForUrl(/Furlì/,
        assertURL.bind(this,
            'Furlì',
            'Casper.getCurrentUrl() retrieves a decoded URL'
        ));

    casper.run(function() {
        test.done();
    });
});

// https://github.com/casperjs/casperjs/issues/841
casper.test.begin('url tests with javascript disabled', 1, function(test) {
    casper.options.pageSettings.javascriptEnabled = false;
    casper.start('tests/site/urls.html');
    casper.then(function() {
        test.assertMatch(this.getCurrentUrl(), /urls\.html$/,
            'Casper.getCurrentUrl() can work, with javascript disabled');
    });
    casper.run(function() {
        test.done();
        casper.options.pageSettings.javascriptEnabled = true;
    });
});
