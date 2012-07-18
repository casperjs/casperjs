casper.test.comment('Casper.getCurrentHeader()');

function dumpHeaders() {
    casper.test.comment('Dumping current response headers');

    casper.getCurrentHeaders().forEach(function(header){
        casper.test.comment('- '+ header.name + ': '+ header.value);
    });
}

casper.start('tests/site/index.html', function then(){
  this.test.assertEquals(casper.getCurrentHeader('Status'), null, 'No Status header on local page');
  this.test.assert(casper.getCurrentHeaders().length === 0, 'No headers sent back');
});


casper.run(function(){
  this.test.done();
});
