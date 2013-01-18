/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('remote script includes tests', 6, function(test) {
    kasper.options.remoteScripts = [
        'includes/include1.js', // local includes are actually served
        'includes/include2.js', // through the local test webserver
        'http://code.jquery.com/jquery-1.8.3.min.js'
    ];

    kasper.start('tests/site/index.html', function() {
        test.assertSelectorHasText('#include1', 'include1',
            'kasper.includeRemoteScripts() includes a first remote script on start');
        test.assertSelectorHasText('#include2', 'include2',
            'kasper.includeRemoteScripts() includes a second remote script on start');
        test.assertEval(function() {
            return 'jQuery' in window;
        }, 'kasper.includeRemoteScripts() includes a really remote file on first step');
    });

    kasper.thenOpen('tests/site/form.html', function() {
        test.assertSelectorHasText('#include1', 'include1',
            'kasper.includeRemoteScripts() includes a first remote script on second step');
        test.assertSelectorHasText('#include2', 'include2',
            'kasper.includeRemoteScripts() includes a second remote script on second step');
        test.assertEval(function() {
            return 'jQuery' in window;
        }, 'kasper.includeRemoteScripts() includes a really remote file on second step');
    });

    kasper.run(function() {
        this.options.remoteScripts = [];
        test.done();
    });
});
