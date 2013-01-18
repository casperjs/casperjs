/*jshint strict:false*/
/*global kasperError kasper console phantom require*/
kasper.test.begin('sendKeys() tests', 2, function(test) {
    kasper.start('tests/site/form.html', function() {
        this.sendKeys('input[name="email"]', 'duke@nuk.em');
        this.sendKeys('textarea', "Damn, I’m looking good.");
        var values = this.getFormValues('form');
        test.assertEquals(values.email, 'duke@nuk.em',
            'kasper.sendKeys() sends keys to given input');
        test.assertEquals(values.content, "Damn, I’m looking good.",
            'kasper.sendKeys() sends keys to given textarea');
    }).run(function() {
        test.done();
    });
});
