/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('prompt tests', 1, function(test) {
    kasper.setFilter('page.prompt', function(message, value) {
        return 'Chuck ' + value;
    });
    kasper.start('tests/site/prompt.html', function() {
        test.assertEquals(this.getGlobal('name'), 'Chuck Norris', 'prompted value has been received');
    }).run(function() {
        test.done();
    });
});
