/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('fetchText() tests', 1, function(test) {
    kasper.start('tests/site/index.html', function() {
        test.assertEquals(this.fetchText('ul li'), 'onetwothree',
            'kasper.fetchText() can retrieve text contents');
    }).run(function() {
        test.done();
    });
});
