/*global casper*/
/*jshint strict:false*/
casper.test.begin('can confirm dialog', 2, function(test) {
    var received;
    casper.removeAllFilters('page.confirm')
    casper.setFilter('page.confirm', function(message) {
        received = message;
        return true;
    });
    casper.start('tests/site/confirm.html', function() {
        test.assert(this.getGlobal('confirmed'), 'confirmation dialog accepted');
    });
    casper.run(function() {
        test.assertEquals(received, 'are you sure?', 'confirmation message is ok');
        test.done();
    });
});

casper.test.begin('can cancel dialog', 1, function(test) {
    casper.removeAllFilters('page.confirm')
    casper.setFilter('page.confirm', function(message) {
        return false;
    });
    casper.start('tests/site/confirm.html', function() {
        test.assertNot(this.getGlobal('confirmed'), 'confirmation dialog canceled');
    });
    casper.run(function() {
        test.done();
    });
});
