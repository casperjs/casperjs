/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('wait*() tests', 3, function(test) {
    var waitStart;

    kasper.start('tests/site/index.html', function() {
        waitStart = new Date().getTime();
    });

    kasper.wait(250, function() {
        test.assert(new Date().getTime() - waitStart > 250,
            'kasper.wait() can wait for a given amount of time');
    });

    kasper.thenOpen('tests/site/waitFor.html', function() {
        this.waitFor(function() {
            return this.evaluate(function() {
                return document.querySelectorAll('li').length === 4;
            });
        }, function() {
            test.pass('kasper.waitFor() can wait for something to happen');
        }, function() {
            test.fail('kasper.waitFor() can wait for something to happen');
        });
    });

    kasper.thenOpen('tests/site/waitFor.html').waitForText('<li>four</li>', function() {
        test.pass('kasper.waitForText() can wait for text');
    }, function() {
        test.fail('kasper.waitForText() can wait for text');
    });

    kasper.run(function() {
        test.done();
    });
});
