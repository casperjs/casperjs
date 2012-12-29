/*global casper*/
/*jshint strict:false*/
casper.test.begin('remote script includes tests', 6, function(test) {
    casper.options.remoteScripts = [
        'includes/include1.js', // local includes are actually served
        'includes/include2.js', // through the local test webserver
        'http://code.jquery.com/jquery-1.8.3.min.js'
    ];

    casper.start('tests/site/index.html', function() {
        test.assertSelectorHasText('#include1', 'include1',
            'Casper.includeRemoteScripts() includes a first remote script on start');
        test.assertSelectorHasText('#include2', 'include2',
            'Casper.includeRemoteScripts() includes a second remote script on start');
        test.assertEval(function() {
            return 'jQuery' in window;
        }, 'Casper.includeRemoteScripts() includes a really remote file on first step');
    });

    casper.thenOpen('tests/site/form.html', function() {
        test.assertSelectorHasText('#include1', 'include1',
            'Casper.includeRemoteScripts() includes a first remote script on second step');
        test.assertSelectorHasText('#include2', 'include2',
            'Casper.includeRemoteScripts() includes a second remote script on second step');
        test.assertEval(function() {
            return 'jQuery' in window;
        }, 'Casper.includeRemoteScripts() includes a really remote file on second step');
    });

    casper.run(function() {
        this.options.remoteScripts = [];
        test.done();
    });
});
