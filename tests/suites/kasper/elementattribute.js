/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('getElementAttribute() tests', 1, function(test) {
    kasper.start('tests/site/elementattribute.html', function() {
        test.assertEquals(this.getElementAttribute('.testo','data-stuff'), 'beautiful string',
            'kasper.getElementAttribute() works as intended');
    }).run(function() {
        test.done();
    });
});
