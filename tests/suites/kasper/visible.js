/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('visibility tests', 4, function(test) {
    kasper.start('tests/site/visible.html', function() {
        test.assert(this.visible('#img1'), 'kasper.visible() can detect if an element is visible');
        test.assert(!this.visible('#img2'), 'kasper.visible() can detect if an element is invisible');
        test.assert(!this.visible('#img3'), 'kasper.visible() can detect if an element is invisible');
        this.waitWhileVisible('#img1', function() {
            test.pass('kasper.waitWhileVisible() can wait while an element is visible');
        }, function() {
            test.fail('kasper.waitWhileVisible() can wait while an element is visible');
        }, 2000);
    });

    kasper.run(function() {
        test.done();
    });
});
