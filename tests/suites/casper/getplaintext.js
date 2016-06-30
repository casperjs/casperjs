/*eslint strict:0*/
casper.test.begin('getPlainText() tests', 1, function(test) {
    casper.start('tests/site/plaintext.notype', function() {
        test.assertEquals(this.getPlainText(), 'This is a plain and very simple sentence.',
            'Casper.getPlainText() can retrieve plain text with no content type');
    }).run(function() {
        test.done();
    });
});
