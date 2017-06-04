/*eslint strict:0*/ 
casper.test.begin('visibility tests', 25, function(test) {
    casper.start('tests/site/visible.html', function() {
        test.assert(!this.visible('#img1'), 'Casper.visible() can detect if an element is not displayed');
        test.assert(this.visible('#img2'), 'Casper.visible() can detect if an element is visible');
        test.assert(!this.visible('#img3'), 'Casper.visible() can detect if an element is invisible');
        test.assert(this.visible('img'), 'Casper.visible() can detect if at least one element is visible');
        test.assert(!this.visible('.hidden'), 'Casper.visible() can detect if all selected elements are invisible');
        test.assert(!this.visible('#html5hidden'), 'Casper.visible() can detect if element is hidden using html5 "hidden" attribute');
        test.assert(!this.visible('#offScreenLeft'), 'Casper.visible() can detect if element is out of the viewport - Left');
        test.assert(!this.visible('#offScreenRight'), 'Casper.visible() can detect if element is out of the viewport - Right');
        test.assert(!this.visible('#offScreenBottom'), 'Casper.visible() can detect if element is out of the viewport - Bottom');
        test.assert(!this.visible('#offScreenTop'), 'Casper.visible() can detect if element is out of the viewport - Top');


        test.assert(!this.visible('#img4a'), 'Casper.visible() can detect if an element is not displayed due to an ancestor');
        test.assert(!this.visible('#img5a'), 'Casper.visible() can detect if an element is invisible due to an ancestor');

        test.assert(!this.visible('#img6'), 'Casper.visible() can detect if a zero-width  element is invisible');
        test.assert(!this.visible('#img7'), 'Casper.visible() can detect if a zero-height element is invisible');


        test.assert(!this.visible('#emptyspan'), 'Casper.visible() correctly detects empty spans as invisible');
        test.assert(!this.visible('#emptydiv'), 'Casper.visible() correctly detects empty divs as invisible');
        test.assert(!this.visible('#br'), 'Casper.visible() correctly detects br tags as invisible');





        test.assert(!this.visible('#button1'), 'Casper.visible() can detect if an element is invisible when parent has display none');
        test.assert(this.visible('#button2'), 'Casper.visible() can detect if an element is visible when parent is visible');
        test.assert(!this.visible('#button3'), 'Casper.visible() can detect if an element is invisible because parent is invisible');
        test.assert(this.visible('#circle1'), 'Casper.visible() can detect if an element inside svg is visible');
        test.assert(!this.visible('#circle2'), 'Casper.visible() can detect if an element inside svg is invisible when parent has display none');
        test.assert(!this.visible('#circle3'), 'Casper.visible() can detect if an element inside svg is invisible when parent has visibility hidden');
        this.waitWhileVisible('#img5', function() {
            test.pass('Casper.waitWhileVisible() can wait while an element is visible');
        }, function() {
            test.fail('Casper.waitWhileVisible() can wait while an element is visible');
        }, 2000);
        this.waitWhileVisible('#button4', function() {
            test.pass('Casper.waitWhileVisible() can wait while an element is visible until parent is hidden');
        }, function() {
            test.fail('Casper.waitWhileVisible() can wait while an element is visible until parent is hidden');
        }, 2000);
    });

    casper.run(function() {
        test.done();
    });
});
