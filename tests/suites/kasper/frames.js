/*global kasper __utils__*/
/*jshint strict:false*/
kasper.test.begin('handling frames', 16, function(test) {
    kasper.start('tests/site/frames.html');

    kasper.withFrame('frame1', function() {
        test.assertTitle('kasperJS frame 1');
        test.assertExists("#f1");
        test.assertDoesntExist("#f2");
        test.assertEval(function() {
            return '__utils__' in window && 'getBinary' in __utils__;
        }, '__utils__ object is available in child frame');
        test.assertMatches(this.page.frameContent, /This is frame 1/);
        test.assertMatches(this.getHTML(), /This is frame 1/);
    });

    kasper.withFrame('frame2', function() {
        test.assertTitle('kasperJS frame 2');
        test.assertExists("#f2");
        test.assertDoesntExist("#f1");
        test.assertEval(function() {
            return '__utils__' in window && 'getBinary' in __utils__;
        }, '__utils__ object is available in other child frame');
        this.clickLabel('frame 3');
    });

    kasper.withFrame('frame2', function() {
        test.assertTitle('kasperJS frame 3');
    });

    kasper.withFrame(0, function() {
        test.assertTitle('kasperJS frame 1');
        test.assertExists("#f1");
        test.assertDoesntExist("#f2");
    });

    kasper.withFrame(1, function() {
        test.assertTitle('kasperJS frame 3');
    });

    kasper.run(function() {
        test.assertTitle('kasperJS test frames');
        test.done();
    });
});
