/*global casper*/
/*jshint strict:false*/
casper.test.begin('viewport() tests', 3, function(test) {
    casper.start();
    casper.viewport(1337, 999);
    test.assertEquals(casper.page.viewportSize.width, 1337,
        'Casper.viewport() can change the width of page viewport');
    test.assertEquals(casper.page.viewportSize.height, 999,
        'Casper.viewport() can change the height of page viewport');
    test.assertRaises(casper.viewport, ['a', 'b'],
        'Casper.viewport() validates viewport size data');
    test.done();
});
