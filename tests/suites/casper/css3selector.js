/*eslint strict:0, max-params:0*/
casper.test.begin('selector() tests', 1, function(test) {
    casper.start('tests/site/selector.html').then(function() {
        var text = this.evaluate(function() {
            return __utils__.findOne('body > div:nth-of-type(3) > span:nth-child(4) > div:last-of-type').innerText;
        });
        test.assertEquals(text, "hello",
            "Casper.Evaluate() get css 3 selector content text");
    });
    casper.run(function() {
        test.done();
    });
});


casper.test.begin('withSelectorScope() tests', 3, function(test) {
    casper.start('tests/site/selector.html').then(function() {
        this.withSelectorScope('div:nth-of-type(2) span', function(){
            test.assertEquals(this.getElementInfo('div:nth-of-type(2)').text, "lost",
                    "Casper.Evaluate() get css 3 selector content text from simple selector scope");
        });
        this.withSelectorScope('div:nth-of-type(2)', function(){
            this.withSelectorScope('span', function(){
                test.assertEquals(this.getElementInfo('div:nth-of-type(2)').text, "lost",
                    "Casper.Evaluate() get css 3 selector content text from double selector scope");
            });
        });
        this.withSelectorScope('div:nth-of-type(3) span', function(){
            test.assertEquals(this.getElementInfo('div:nth-of-type(2)').text, "hello",
                "Casper.Evaluate() get css 3 selector content text from another selector scope");
        });
    });    
    casper.run(function() {
        test.done();
    });
});
