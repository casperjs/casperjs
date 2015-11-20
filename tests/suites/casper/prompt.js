/*global casper*/
/*jshint strict:false*/
casper.test.begin('prompt tests', 1, function(test) {
    casper.setFilter('page.prompt', function(message, value) {
        return 'Chuck ' + value;
    });
    casper.options.pageSettings.javascriptEnabled = true;
    casper.start('tests/site/prompt.html', function() {
        test.assertEquals(this.getGlobal('username'), 'Chuck Norris', 'prompted value has been received');
    }).run(function() {
        test.done();
    });
});
