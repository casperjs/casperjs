/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('getHTML() tests', 2, function(test) {
    kasper.start('tests/site/index.html', function() {
        test.assertEquals(this.getHTML('ul li'), 'one',
            'kasper.getHTML() retrieves inner HTML by default');
        test.assertEquals(this.getHTML('ul li', true), '<li>one</li>',
            'kasper.getHTML() can retrieve outer HTML');
    }).run(function() {
        test.done();
    });
});
