/*global casper*/
/*jshint strict:false*/
var x = require('casper').selectXPath;

casper.test.begin('getElementAttribute() tests', 2, function(test) {
    casper.start('tests/site/elementattribute.html', function() {
        test.assertEquals(this.getElementAttribute('.testo', 'data-stuff'),
            'beautiful string', 'Casper.getElementAttribute() works with a CSS selector');
        test.assertEquals(this.getElementAttribute(x('//div[@class]'), 'data-stuff'),
            'beautiful string', 'Casper.getElementAttribute() works with a XPath selector');
    }).run(function() {
        test.done();
    });
});
