/*eslint strict:0, max-statements:0*/
/*global CasperError, casper, console, phantom, require*/
var utils = require('utils');
var x = require('casper').selectXPath;


//------------------------------------------------
casper.test.begin('multiple-popups tests', 20, function(test) {

    casper.removeAllListeners('popup.created');
    casper.removeAllListeners('popup.loaded');
    casper.removeAllListeners('popup.closed');

    casper.on('popup.created', function(popup) {
        test.pass('"popup.created" event is fired');
        test.assert(utils.isWebPage(popup),
            '"popup.created" event callback get a popup page instance');
    });

    casper.once('popup.loaded', function(popup) {
        test.pass('"popup.loaded" event is fired');
        test.assertEquals(popup.evaluate(function() {
            return document.title;
        }), 'CasperJS test close-popup',
            '"popup.loaded" is triggered when popup content is actually loaded');
            
        casper.once('popup.loaded', function(popup) {
            test.pass('"popup.loaded" event is fired on second level of popup');
            test.assertEquals(popup.evaluate(function() {
                return document.title;
            }), 'CasperJS test index',
            '"popup.loaded" is triggered when popup content is actually loaded');
            this.removeAllListeners('popup.created');
            this.removeAllListeners('popup.loaded');
            this.removeAllListeners('popup.closed');
        });
    });

    casper.once('popup.closed', function(popup) {
        test.assertEquals(0, 0, '"popup.closed" event is fired ['+popup.windowName+']');
    });

    casper.start('tests/site/multiple-popups.html');

    casper.waitForSelector('.openpopup', function success() {
        casper.test.assertExists('.openpopup');
        casper.mouse.move('.openpopup');
        casper.click('.openpopup');
    }, function fail() {
        casper.test.assertExists('.openpopup');
    });

    casper.waitForPopup( /close\.html/, function then() {
        test.pass('Casper.waitForPopup() waits for a popup being created [close]');
        test.assertEquals(this.popups.length, 1, 'A popup has been added [close]');
        test.assert(utils.isWebPage(this.popups[0]), 'A popup is a WebPage [close]');
    
        casper.waitForPopup( /index\.html/, function then() {
            test.pass('Casper.waitForPopup() waits for a popup being created [index]');
            test.assertEquals(this.popups.length, 2, 'A popup has been added [index]');
            test.assert(utils.isWebPage(this.popups[0]), 'A popup is a WebPage [index]');
    
            casper.withPopup('close.html', function() {
                test.assertTitle('CasperJS test close-popup',
                    'Casper.withPopup() found a popup with expected title');
                test.assertUrlMatches(/close\.html$/,
                    'Casper.withPopup() switched to popup as current active one');
                test.assertEval(function() {
                    return '__utils__' in window;
                }, 'Casper.withPopup() has client utils injected');
                casper.click('.closepopup');
            });
        });
    });

    casper.then(function() {
        test.assertUrlMatches(/multiple-popups\.html$/,
            'Casper.withPopup() has reverted to main page after using the popup');
            
    });

    casper.then(function() {
        casper.evaluate(function(){
            window.close();
        });
        test.assertUrlMatches(/about:blank|multiple-popups.html/,
            'Casper.withPopup() has ropened a new page after closing main page');
    });

    casper.run(function() {
        setTimeout(function(){
            test.done();
        }, 500);
    });
});
