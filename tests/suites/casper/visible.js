/*eslint strict:0*/
casper.test.begin('visibility tests', 11, function(test) {
    casper.start('tests/site/visible.html', function() {
        test.assert(!this.visible('#img1'), 'Casper.visible() can detect if an element is invisible');
        test.assert(this.visible('#img2'), 'Casper.visible() can detect if an element is visible');
        test.assert(!this.visible('#img3'), 'Casper.visible() can detect if an element is invisible');
        test.assert(this.visible('#img4'), 'Casper.visible() can detect if an element with display:flex is visible');
        test.assert(this.visible('img'), 'Casper.visible() can detect if an element is visible');
        test.assert(!this.visible('#button1'), 'Casper.visible() can detect if an element is invisible when parent has display none');
        test.assert(this.visible('#button2'), 'Casper.visible() can detect if an element is visible when parent is visible');
        test.assert(this.visible('#circle1'), 'Casper.visible() can detect if an element inside svg is visible');
        test.assert(!this.visible('#circle2'), 'Casper.visible() can detect if an element inside svg is invisible when parent has display none');
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
