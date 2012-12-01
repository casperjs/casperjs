/*global casper*/
/*jshint strict:false*/
var received;

casper.setFilter('page.confirm', function(message) {
    received = message;
    return true;
});

casper.start('tests/site/confirm.html', function() {
    this.test.assert(this.getGlobal('confirmed'), 'confirmation received');
});

casper.run(function() {
    this.test.assertEquals(received, 'are you sure?', 'confirmation message is ok');
    this.test.done(2);
});
