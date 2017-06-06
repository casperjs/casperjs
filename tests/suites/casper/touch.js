/*global casper*/
/*jshint strict:false, maxstatements: 99*/
var utils = require('utils');

casper.test.begin('ontouch variants tests', 6, function(test) {
    casper.start('tests/site/touch.html', function() {
        test.assert(this.touch('#test1'), 'Casper.touch() can touch an unobstrusive js handled div');
        test.assert(this.touch('#test2'), 'Casper.touch() can touch an `ontouch=".*"` div');
        test.assert(this.touch('#test3'), 'Casper.touch() can touch an `ontouch=".*; return false"` div');
        var results = this.getGlobal('results');
        if (phantom.casperEngine === 'slimerjs') {
            // "javascript:" link in Gecko are executed asynchronously, so we don't have result at this time
            test.skip(1)
        }
        else
            test.assert(results.test1, 'Casper.touch() has touched an unobstrusive js handled div');
        test.assert(results.test2, 'Casper.touch() has touched an `ontouch=".*"` div');
        test.assert(results.test3, 'Casper.touch() has touched an `ontouch=".*; return false"` div');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('touch events on touch', 3, function(test) {
    casper.start('tests/site/touch.html', function() {
        this.touch('#test5');
    }).then(function() {
        var results = this.getGlobal('results');
        test.assert(results.test5.indexOf('touchstart') !== -1,
            'Casper.touch() triggers touchstart event');
        test.assert(results.test5.indexOf('touchmove') === -1,
            'Casper.touch() doesn\'t trigger touchmove event');
        test.assert(results.test5.indexOf('touchend') !== -1,
            'Casper.touch() triggers touchend event');
    }).run(function() {
        test.done();
    });
});
