/*jshint strict:false*/
/*global CasperError casper console phantom require*/
casper.test.begin('sendKeys() tests', 2, function(test) {
    casper.start('tests/site/form.html', function() {
        this.sendKeys('input[name="email"]', 'duke@nuk.em');
        this.sendKeys('textarea', "Damn, I’m looking good.");
        var values = this.getFormValues('form');
        test.assertEquals(values.email, 'duke@nuk.em',
            'Casper.sendKeys() sends keys to given input');
        test.assertEquals(values.content, "Damn, I’m looking good.",
            'Casper.sendKeys() sends keys to given textarea');
    }).run(function() {
        test.done();
    });
});
