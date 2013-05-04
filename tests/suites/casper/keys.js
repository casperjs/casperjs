/*jshint strict:false*/
/*global CasperError, casper, console, phantom, require*/
casper.test.begin('sendKeys() tests', 3, function(test) {
    casper.start('tests/site/form.html', function() {
        this.sendKeys('input[name="email"]', 'duke@nuk.em');
        this.sendKeys('input[name="language"]', 'fr', {keepFocus: true});
        this.click('#autocomplete li:first-child');
        this.sendKeys('textarea', "Damn, I’m looking good.");
        var values = this.getFormValues('form');
        test.assertEquals(values.email, 'duke@nuk.em',
            'Casper.sendKeys() sends keys to given input');
        test.assertEquals(values.language, 'french',
            'Casper.sendKeys() sends keys to given input and keeps focus afterweards');
        test.assertEquals(values.content, "Damn, I’m looking good.",
            'Casper.sendKeys() sends keys to given textarea');
    }).run(function() {
        test.done();
    });
});
