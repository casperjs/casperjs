/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('viewport() tests', 3, function(test) {
    kasper.start();
    kasper.viewport(1337, 999);
    test.assertEquals(kasper.page.viewportSize.width, 1337,
        'kasper.viewport() can change the width of page viewport');
    test.assertEquals(kasper.page.viewportSize.height, 999,
        'kasper.viewport() can change the height of page viewport');
    test.assertRaises(kasper.viewport, ['a', 'b'],
        'kasper.viewport() validates viewport size data');
    test.done();
});
