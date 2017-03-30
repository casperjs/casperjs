/*eslint strict:0*/
casper.test.begin('handling frames', 37, function(test) {
    casper.start('tests/site/frames.html');

    casper.on("frame.reset", function(frameInfos) {
       // console.log(frameInfos.join('-'), 'forceReloaded');
    });
    
    casper.viewport(800,600);
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
            test.assertEquals( casper.getElementInfo('a').width,100,'read tag a position');
            casper.mouse.move('a');
            test.assertEquals( casper.getElementInfo('a').width,200,'read tag a position hovered');
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

    casper.thenOpen("tests/site/frames.html", function() {
        var expected = ['frame1','frame1', 'frame2', 'frame2'];
        casper.page.switchToMainFrame();
        casper.on('frame.changed', function (name, status) {
          test.assertEquals(name, expected.shift());
        });
        casper.switchToFrame("frame1");
        test.assertTitle('CasperJS frame 1');
        casper.then(function() {
            // Same frame in next step
            test.assertTitle('CasperJS frame 1');
            casper.switchToParentFrame();
            test.assertTitle("CasperJS test frames");
            casper.switchToFrame("frame2");
            test.assertTitle('CasperJS frame 2');
            casper.switchToMainFrame();
            test.assertTitle("CasperJS test frames");
            this.removeAllListeners('frame.changed');
        });
    });

    casper.thenOpen("tests/site/frames.html", function(){
        var expected = ['frame4','frame5', 'frame5','frame4'];
        casper.page.switchToMainFrame();
        casper.on('frame.changed', function (name , status) {
          test.assertEquals(name, expected.shift());
        });
        casper.switchToFrame("frame4");
        test.assertTitle('CasperJS frame 4');
        casper.switchToFrame("frame5");
        test.assertTitle('CasperJS frame 1');
        casper.clickLabel('_top');
    });
    
    casper.then(function() {
        casper.switchToParentFrame();
        casper.switchToParentFrame();
        casper.waitForText("three",function(){
            test.assertMatches( this.getHTML(),/three/,'go on top frame');
        });
        casper.switchToParentFrame();
        casper.switchToParentFrame();
        casper.switchToParentFrame();
        casper.switchToParentFrame();
        casper.switchToParentFrame();
        this.removeAllListeners('frame.changed');
    });

    casper.run(function() {
        test.assertTitle('CasperJS test index');
        test.done();
    });
});
