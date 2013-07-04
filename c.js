/*jshint strict:false*/
/*global CasperError, console, phantom, require*/
var casper = require('casper').create();

casper.start('t.html', function() {
  this.fill('#first', {title: 'plop'}, false);
  this.echo(this.getFormValues('#first').title); // 'plop'
});

casper.run();
