/*global casper*/
/*jshint strict:false*/
var x = require('casper').selectXPath;

casper.start('tests/site/elementattribute.html', function() {
    this.test.comment('Casper.getElementAttribute()');
    this.test.assertEquals(this.getElementAttribute('.testo', 'data-stuff'),
      'beautiful string', 'Casper.getElementAttribute() works with a CSS selector');
    this.test.assertEquals(this.getElementAttribute(x('//div[@class]'), 'data-stuff'),
      'beautiful string', 'Casper.getElementAttribute() works with a XPath selector');
});

casper.run(function() {
    this.test.done(2);
});
