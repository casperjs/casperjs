/*jshint strict:false maxstatements:99*/
/*global kasperError kasper console phantom require*/
var utils = require('utils');
var x = require('kasper').selectXPath;

kasper.test.begin('popup tests', 20, function(test) {
    kasper.once('popup.created', function(popup) {
        test.pass('"popup.created" event is fired');
        test.assert(utils.isWebPage(popup),
            '"popup.created" event callback get a popup page instance');
    });

    kasper.once('popup.loaded', function(popup) {
        test.pass('"popup.loaded" event is fired');
        test.assertEquals(popup.evaluate(function() {
            return document.title;
        }), 'kasperJS test index',
            '"popup.loaded" is triggered when popup content is actually loaded');
    });

    kasper.once('popup.closed', function(popup) {
        test.assertEquals(this.popups.length, 0, '"popup.closed" event is fired');
    });

    kasper.start('tests/site/popup.html');

    kasper.waitForPopup('index.html', function() {
        test.pass('kasper.waitForPopup() waits for a popup being created');
        test.assertEquals(this.popups.length, 1, 'A popup has been added');
        test.assert(utils.isWebPage(this.popups[0]), 'A popup is a WebPage');
    });

    kasper.withPopup('index.html', function() {
        test.assertUrlMatches(/index\.html$/,
            'kasper.withPopup() switched to popup as current active one');
        test.assertEval(function() {
            return '__utils__' in window;
        }, 'kasper.withPopup() has client utils injected');
        test.assertExists('h1',
            'kasper.withPopup() can perform assertions on the DOM');
        test.assertExists(x('//h1'),
            'kasper.withPopup() can perform assertions on the DOM using XPath');
    });

    kasper.then(function() {
        test.assertUrlMatches(/popup\.html$/,
            'kasper.withPopup() has reverted to main page after using the popup');
    });

    kasper.thenClick('.close', function() {
        test.assertEquals(this.popups.length, 0, 'Popup is removed when closed');
    });

    kasper.thenOpen('tests/site/popup.html');

    kasper.waitForPopup(/index\.html$/, function() {
        test.pass('kasper.waitForPopup() waits for a popup being created');
    });

    kasper.withPopup(/index\.html$/, function() {
        test.assertTitle('kasperJS test index',
            'kasper.withPopup() can use a regexp to identify popup');
    });

    kasper.thenClick('.close', function() {
        test.assertUrlMatches(/popup\.html$/,
            'kasper.withPopup() has reverted to main page after using the popup');
        test.assertEquals(this.popups.length, 0, 'Popup is removed when closed');
        this.removeAllListeners('popup.created');
        this.removeAllListeners('popup.loaded');
        this.removeAllListeners('popup.closed');
    });

    kasper.thenClick('a[target="_blank"]');

    kasper.waitForPopup('form.html', function() {
        test.pass('kasper.waitForPopup() waits when clicked on a link with target=_blank');
    });

    kasper.withPopup('form.html', function() {
        test.assertTitle('kasperJS test form');
    });

    kasper.run(function() {
        test.done();
    });
});
