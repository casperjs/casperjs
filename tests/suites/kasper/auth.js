/*global kasper*/
/*jshint strict:false maxstatements:99*/

kasper.test.begin('HTTP authentication tests', 8, function(test) {
    kasper.start('tests/site/index.html');

    kasper.configureHttpAuth('http://localhost/');
    test.assertEquals(kasper.page.settings.userName, undefined);
    test.assertEquals(kasper.page.settings.password, undefined);

    kasper.configureHttpAuth('http://niko:plop@localhost/');
    test.assertEquals(kasper.page.settings.userName, 'niko');
    test.assertEquals(kasper.page.settings.password, 'plop');

    kasper.configureHttpAuth('http://localhost/', {username: 'john', password: 'doe'});
    test.assertEquals(kasper.page.settings.userName, 'john');
    test.assertEquals(kasper.page.settings.password, 'doe');

    kasper.configureHttpAuth('http://niko:plop@localhost/', {username: 'john', password: 'doe'});
    test.assertEquals(kasper.page.settings.userName, 'niko');
    test.assertEquals(kasper.page.settings.password, 'plop');

    kasper.run(function() {
        test.done();
    });
});
