(function(t) {
    t.comment('Casper.viewport()');

    casper.start();

    casper.viewport(1337, 999);

    t.assertEquals(casper.page.viewportSize.width, 1337, 'Casper.viewport() can change the width of page viewport');
    t.assertEquals(casper.page.viewportSize.height, 999, 'Casper.viewport() can change the height of page viewport');
    t.assertRaises(casper.viewport, ['a', 'b'], 'Casper.viewport() validates viewport size data');

    t.done();
})(casper.test);
