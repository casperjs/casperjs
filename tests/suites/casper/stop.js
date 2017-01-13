/*eslint strict:0*/

casper.test.begin('Casper.stop() can stop before to run test', 1, function(test) {
    casper.start();
    casper.then(function(){
        test.fail("This test should not be executed.");
    });
    casper.stop().run(function() {
        test.pass("run has been stopped");
        test.done();
    });
});


casper.test.begin('Casper.stop() can stop a running test', 2, function(test) {
    casper.start();
    casper.then(function(){
        test.pass("This test should be executed.");
        casper.stop();
    });
    casper.then(function(){
        test.fail("This test should not be executed.");
    });    
    casper.run(function() {
        test.pass("run has been stopped");
        test.done();
    });
});

casper.test.begin('Casper.stop() can stop on timeout', 1, function(test) {
    casper.start();
    var onWaitTimeoutFn = casper.options.onWaitTimeout;
    var waitTimeoutVar = casper.options.waitTimeout;
    casper.options.waitTimeout = 500;

    casper.options.onWaitTimeout = function _onWaitTimeout(timeout) {
        this.options.onWaitTimeout = onWaitTimeoutFn;
        this.options.waitTimeout = waitTimeoutVar;        
        this.stop();
    };

    casper.then(function(){
        this.waitFor(function check() {
            return 1 === 0;
        },function(){});
    });
    casper.then(function(){
        test.fail("This test should not be executed.");
    });    
    casper.run(function() {
        test.pass("run has been stopped");
        test.done();
    });
});

casper.test.begin('Casper.stop() and restart a new run', 2, function(test) {
    casper.start();
    casper.then(function(){
        test.fail("This test should not be executed.");
    });
    casper.stop().run(function() {
        casper.start();
        casper.then(function(){
            test.pass("This test should not be executed.");
        });
        casper.run(function() {
            test.pass("run has been stopped");
            test.done();
        });
    });
});

//----------------------------------------------------------------------
casper.test.begin('Casper.abort() can stop before to run test', 1, function(test) {
    casper.start();
    casper.then(function(){
        test.fail("This test should not be executed.");
    });
    casper.abort(function(){
        test.pass("run has been aborted");
        test.done();
    });
    casper.run(function() {
        test.fail("run has not been aborted");
        
    });
});

casper.test.begin('Casper.abort() can stop a running test', 2, function(test) {
    casper.start();
    casper.then(function(){
        test.pass("This test should be executed.");
        casper.abort(function(){
            test.pass("run has been aborted");
            test.done();
        });
    });
    casper.then(function(){
        test.fail("This test should not be executed.");
    });    
    casper.run(function() {
        test.fail("run has not been aborted");
        test.done();
    });
});

//

casper.test.begin('Casper.abort() can stop on timeout', 1, function(test) {
    casper.start();
    var onWaitTimeoutFn = casper.options.onWaitTimeout;
    var waitTimeoutVar = casper.options.waitTimeout;
    casper.options.waitTimeout = 500;

    casper.options.onWaitTimeout = function _onWaitTimeout(timeout) {
        this.options.onWaitTimeout = onWaitTimeoutFn;
        this.options.waitTimeout = waitTimeoutVar;    
        casper.abort(function(){
            test.pass("run has been aborted");
            test.done();
        });
    };

    casper.then(function(){
        this.waitFor(function check() {
            return 1 === 0;
        },function(){});
    });
    casper.then(function(){
        test.fail("This test should not be executed.");
    });    
    casper.run(function() {
        test.fail("run has not been aborted");
    });
});

casper.test.begin('Casper.abort() and restart a new run', 3, function(test) {
    casper.start();
    casper.then(function(){
        test.fail("This test should not be executed.");
    });
    
    casper.abort(function(){
        test.pass("run has been aborted");
        casper.start();
        casper.then(function(){
            test.pass("This test should not be executed.");
        });
        casper.run(function() {
            test.pass("This test should not be executed.");
            test.done();
        });
    });
        
    casper.run(function() {
        test.fail("run has not been aborted");
        casper.start();
        casper.then(function(){
            test.pass("This test should not be executed.");
        });
        casper.run(function() {
            
        });
    });
});
