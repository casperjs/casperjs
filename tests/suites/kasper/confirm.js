/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('can confirm dialog', 2, function(test) {
    var received;
    kasper.removeAllFilters('page.confirm')
    kasper.setFilter('page.confirm', function(message) {
        received = message;
        return true;
    });
    kasper.start('tests/site/confirm.html', function() {
        test.assert(this.getGlobal('confirmed'), 'confirmation dialog accepted');
    });
    kasper.run(function() {
        test.assertEquals(received, 'are you sure?', 'confirmation message is ok');
        test.done();
    });
});

kasper.test.begin('can cancel dialog', 1, function(test) {
    kasper.removeAllFilters('page.confirm')
    kasper.setFilter('page.confirm', function(message) {
        return false;
    });
    kasper.start('tests/site/confirm.html', function() {
        test.assertNot(this.getGlobal('confirmed'), 'confirmation dialog canceled');
    });
    kasper.run(function() {
        test.done();
    });
});
