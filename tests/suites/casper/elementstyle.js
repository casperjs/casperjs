/*global casper, __utils__*/
/*jshint strict:false*/
casper.test.begin('getElementStyle() tests', 6, function(test) {
    casper.start('tests/site/visible.html', function() {
        test.assertEvalEquals(function(){return __utils__.getElementStyle('#img1').display;},
            "inline",'Casper.getElementStyle() works with a CSS selector');
        test.assertEvalEquals(function(){return __utils__.getElementStyle({type:'xpath',path:'//img[@id="img1"]'}).display;},
            "inline",'Casper.getElementStyle() works with a XPath selector');
        test.assertEvalEquals(function(){return __utils__.getElementStyle('#img2').display;},
            "inline",'Casper.getElementStyle() works with a CSS selector');
        test.assertEvalEquals(function(){return __utils__.getElementStyle('#img3').visibility;},
            "hidden",'Casper.getElementStyle() works with a CSS selector');
        test.assertEvalEquals(function(){return __utils__.getElementStyle('#img2').visibility;},
            "visible",'Casper.getElementStyle() works with a CSS selector');
        this.waitStyleProperties('#img1', function(styleProperties) {
            return (styleProperties.display === "inline")?true:false;
        },
        function(){
                test.pass('Casper.waitStyleProperties() can wait while a property is applied');
            }, function() {
                test.fail('Casper.waitStyleProperties() can wait while a property is applied');
        }, 2000);
    }).run(function() {
        test.done();
    });
});
