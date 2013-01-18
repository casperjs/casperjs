/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('handling navigation history', 4, function(test) {
    kasper.start('tests/site/page1.html');
    kasper.thenOpen('tests/site/page2.html');
    kasper.thenOpen('tests/site/page3.html');
    kasper.back();
    kasper.then(function() {
        test.assertMatch(this.getCurrentUrl(), /tests\/site\/page2\.html$/,
            'kasper.back() can go back an history step');
    });
    kasper.forward();
    kasper.then(function() {
        test.assertMatch(this.getCurrentUrl(), /tests\/site\/page3\.html$/,
            'kasper.forward() can go forward an history step');
    });
    kasper.run(function() {
        test.assert(this.history.length > 0, 'kasper.history contains urls');
        test.assertMatch(this.history[0], /tests\/site\/page1\.html$/,
            'kasper.history has the correct first url');
        test.done();
    });
});
