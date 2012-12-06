/*jshint strict:false*/
/*global CasperError casper console phantom require*/
var utils = require('utils');
var x = require('casper').selectXPath;

casper.on('child.page.created', function(page) {
    this.test.pass('child.page.created event is fired');
    this.test.assert(utils.isWebPage(page),
        'child.page.created event callback get a child WebPage instance');
});

casper.on('child.page.loaded', function(page) {
    this.test.pass('child.page.loaded event is fired');
    this.test.assertEquals(page.evaluate(function() {
        return document.title;
    }), 'CasperJS test index',
        'child.page.loaded is triggered when child page contents are actually loaded');
});

casper.on('child.page.closed', function(page) {
    this.test.assertEquals(this.childPages.length, 0, 'child.page.closed event is fired');
});

casper.start('tests/site/child-page.html');

casper.waitForPage('index.html', function() {
    this.test.pass('Casper.waitForPage() waits for a child page being created');
    this.test.assertEquals(this.childPages.length, 1, 'A child page has been added');
    var childPage = this.childPages[0];
    this.test.assert(utils.isWebPage(childPage), 'A child page is a WebPage');
    this.withChildPage(childPage, function() {
        this.test.assertEquals(this.page.id, childPage.id,
            'Casper.withChildPage() switched to child page as current active one');
        this.test.assertEval(function() {
            return '__utils__' in window;
        }, 'Casper.withChildPage() has client utils injected');
        this.test.assertTitle('CasperJS test index',
            'Casper.withChildPage() can perform evaluation on the active child page');
        this.test.assertExists('h1',
            'Casper.withChildPage() can perform assertions on the DOM');
        this.test.assertExists(x('//h1'),
            'Casper.withChildPage() can perform assertions on the DOM using XPath');
    });
});

casper.thenClick('.close', function() {
    this.test.assertEquals(this.childPages.length, 0, 'Child page is removed when closed');
});

casper.run(function() {
    this.test.done(14);
});
