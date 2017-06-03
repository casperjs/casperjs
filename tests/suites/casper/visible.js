/*eslint strict:0*/ 
casper.test.begin('visibility tests', 13, function(test) {
    casper.start('tests/site/visible.html', function() {
        var start = new Date();

        test.assert(!this.visible('#img1'), 'Casper.visible() can detect if an element is not displayed');
        test.assert(this.visible('#img2'), 'Casper.visible() can detect if an element is visible');
        test.assert(!this.visible('#img3'), 'Casper.visible() can detect if an element is invisible');
        test.assert(this.visible('img'), 'Casper.visible() can detect if an element is visible');

        this.waitUntilVisible('#img1', function(){
            var end = new Date();
            var elapsed = end - start;

            test.assert(elapsed > 1000, 'Casper.waitUntilVisible() can wait until an element is visible');
        }, function() {
            test.fail('Casper.waitUntilVisible() can wait until an element is visible');
        }, 2000);

        this.waitWhileVisible('#img1', function() {
            var end = new Date();
            var elapsed = end - start;

            test.assert(elapsed > 2000, 'Casper.waitWhileVisible() can wait while an element is visible');
        }, function() {
            test.fail('Casper.waitWhileVisible() can wait while an element is visible');
        }, 2000);

        test.assert(!this.visible('#img4'), 'Casper.visible() can detect if an element is not displayed due to an ancestor');
        test.assert(!this.visible('#img5'), 'Casper.visible() can detect if an element is invisible due to an ancestor');

        test.assert(!this.visible('#img6'), 'Casper.visible() can detect if a zero-width  element is invisible');
        test.assert(!this.visible('#img7'), 'Casper.visible() can detect if a zero-height element is invisible');


        test.assert(!this.visible('#emptyspan'), 'Casper.visible() correctly detects empty spans as invisible');
        test.assert(!this.visible('#emptydiv'), 'Casper.visible() correctly detects empty divs as invisible');
        test.assert(!this.visible('#br'), 'Casper.visible() correctly detects br tags as invisible');
    });

    casper.run(function() {
        test.done();
    });
});
