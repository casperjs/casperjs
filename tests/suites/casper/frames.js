/*global casper __utils__*/
/*jshint strict:false*/
casper.start('tests/site/frames.html', function() {
    this.test.assertTitle('CasperJS test frames');
    this.page.switchToChildFrame("frame1");
    this.test.assertTitle('CasperJS frame 1');
    this.test.assertExists("#f1");
    this.test.assertDoesntExist("#f2");
    this.page.switchToParentFrame();
    this.page.switchToChildFrame("frame2");
    this.test.assertTitle('CasperJS frame 2');
    this.test.assertExists("#f2");
    this.test.assertDoesntExist("#f1");
    this.test.assertEval(function() {
        return '__utils__' in window && 'getBinary' in __utils__;
    }, '__utils__ object is available in child frame');
});

casper.run(function() {
    this.page.switchToMainFrame();
    this.test.done();
});
