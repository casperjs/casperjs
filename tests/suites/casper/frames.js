/*eslint strict:0*/
casper.test.begin('handling frames', 19, function(test) {
    casper.start('tests/site/frames.html');

    casper.then( function(){
        casper.withFrame('frame1', function() {
            test.assertTitle('CasperJS frame 1');
            test.assertExists("#f1");
            test.assertDoesntExist("#f2");
            test.assertEval(function() {
                return '__utils__' in window && 'getBinary' in __utils__;
            }, '__utils__ object is available in child frame');
            test.assertMatches(this.page.frameContent, /This is frame 1/);
            test.assertMatches(this.getHTML(), /This is frame 1/);
        });

        casper.withFrame('frame2', function() {
            test.assertTitle('CasperJS frame 2');
            test.assertExists("#f2");
            test.assertDoesntExist("#f1");
            test.assertEval(function() {
                return '__utils__' in window && 'getBinary' in __utils__;
            }, '__utils__ object is available in other child frame');
            this.clickLabel('frame 3');
        });

        casper.withFrame('frame2', function() {
            test.assertTitle('CasperJS frame 3');
        });

        casper.withFrame(0, function() {
            test.assertTitle('CasperJS frame 1');
            test.assertExists("#f1");
            test.assertDoesntExist("#f2");
        });

        casper.withFrame(1, function() {
            test.assertTitle('CasperJS frame 3');
        });
        
        casper.withFrame('frame4', function() {
            casper.then(function(){
                casper.withFrame('frame5', function() {
                    casper.clickLabel('_self');
                    // message three is unpresent on frame 5 but as frame 5 was clean
                    // casperJS search on its parent frame
                    casper.waitForText("three",function(){
                        test.assertMatches( this.getHTML(),/three/,'go on self frame');
                    });
                });
            });
         });
        
    });
    casper.thenOpen("tests/site/frames.html", function(){
        casper.withFrame('frame4', function() {
            casper.then(function(){
                casper.withFrame('frame5', function() {
                    casper.clickLabel('_parent');
                });
                casper.waitForText("three",function(){
                    test.assertMatches( this.getHTML(),/three/,'go on parent frame');
                });
            });
         });
    });

    casper.thenOpen("tests/site/frames.html", function(){
        casper.withFrame('frame4', function() {
            casper.then(function(){
                casper.withFrame('frame5', function() {
                    casper.clickLabel('_top');
                    // message three is unpresent on frame 5 but as frame 5 was clean
                    // casperJS search on its parent frame
                });
            });
         });
         casper.waitForText("three",function(){
            test.assertMatches( this.getHTML(),/three/,'go on top frame');
        });
    });

    casper.run(function() {
        test.assertTitle('CasperJS test index');
        test.done();
    });
});
