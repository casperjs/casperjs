/*global casper*/
/*jshint strict:false*/
casper.test.begin('fetchText() tests', 1, function(test) {
    casper.start('tests/site/index.html', function() {
        test.assertEquals(this.fetchText('ul li'), 'onetwothree',
            'Casper.fetchText() can retrieve text contents');
    }).run(function() {
        test.done();
    });
});
