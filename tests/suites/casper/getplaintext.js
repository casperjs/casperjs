/*eslint strict:0*/
casper.test.begin('getPlainText() handles plain texts', 1, function(test) {
    casper.start().then(function() {
        this.setContent('This is a plain text.');
        test.assertEquals(this.getPlainText(), 'This is a plain text.',
            'Casper.getPlainText() handles plain texts');
    });
    casper.run(function() {
        test.done();
    });
});
