/*global casper __utils__*/
/*jshint strict:false*/
casper.start('tests/site/frames.html');

casper.waitForFrame('frame1', function() {
    this.test.pass('Casper.waithForFrame() can wait for a frame to be loaded.');
    this.test.assertTitle('CasperJS test frames');
});

casper.waitForFrame('frame2', function() {
    this.test.pass('Casper.waithForFrame() can wait for another frame to be loaded.');
    this.test.assertTitle('CasperJS test frames');
});

casper.withFrame('frame1', function() {
    this.test.assertTitle('CasperJS frame 1');
});

casper.withFrame('frame2', function() {
    this.test.assertTitle('CasperJS frame 2');
});

casper.run(function() {
    this.test.assertTitle('CasperJS test frames');
    this.test.done(7);
});
