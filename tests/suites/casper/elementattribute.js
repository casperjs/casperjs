/*global casper*/
/*jshint strict:false*/
casper.test.begin('getElementAttribute() tests', 1, function(test) {
    casper.start('tests/site/elementattribute.html', function() {
        test.assertEquals(this.getElementAttribute('.testo','data-stuff'), 'beautiful string',
            'Casper.getElementAttribute() works as intended');
    }).run(function() {
        test.done();
    });
});
