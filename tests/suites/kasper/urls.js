/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('urls tests', 6, function(test) {
    kasper.start('tests/site/urls.html', function() {
        this.clickLabel('raw unicode', 'a');
    });

    kasper.then(function() {
        test.assertHttpStatus(200);
        test.assertUrlMatches('Forlì', 'kasper.getCurrentUrl() retrieves a raw unicode URL');
        this.clickLabel('escaped', 'a');
    });

    kasper.then(function() {
        test.assertHttpStatus(200);
        test.assertUrlMatches('Forlì', 'kasper.getCurrentUrl() retrieves an escaped URL');
        this.clickLabel('uri encoded', 'a');
    });

    kasper.run(function() {
        test.assertHttpStatus(200);
        test.assertUrlMatches('Forlì', 'kasper.getCurrentUrl() retrieves a decoded URL');
        test.done();
    });
});
