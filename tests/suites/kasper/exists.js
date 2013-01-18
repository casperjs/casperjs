/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('exists() tests', 2, function(test) {
    kasper.start('tests/site/index.html', function() {
        test.assert(this.exists('a'), 'kasper.exists() can check if an element exists');
        test.assertNot(this.exists('chucknorriz'), 'kasper.exists() can check than an element does not exist')
    }).run(function() {
        test.done();
    });
});
