/*eslint strict:0*/
casper.test.begin('alert events', 1, {
    ok: false,

    tearDown: function(test) {
        casper.removeAllListeners('remote.alert');
    },

    test: function(test) {
        var self = this;

        casper.once('remote.alert', function(message) {
            self.ok = (message === 'plop');
        });

        casper.start('tests/site/alert.html', function() {
            test.assert(self.ok, 'alert event has been intercepted');
        });

        casper.run(function() {
            test.done();
        });
    }
});

casper.test.begin("Casper.waitForAlert() waits for an alert", 1, function(test) {
    casper.start().then(function() {
        this.evaluate(function() {
            setTimeout(function() {
                alert("plop");
            }, 500);
        });
    });

    casper.waitForAlert(function(response) {
        test.assertEquals(response.data, "plop",
            "Casper.waitForAlert() can wait for an alert to be triggered");
    });

    casper.run(function() {
        test.done();
    });
});
