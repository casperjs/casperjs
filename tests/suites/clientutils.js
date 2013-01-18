/*global kasper*/
/*jshint strict:false*/
var fs = require('fs');
var x = require('kasper').selectXPath;

function fakeDocument(html) {
    window.document.body.innerHTML = html;
}

kasper.test.begin('ClientUtils.encode() tests', 6, function(test) {
    var clientutils = require('clientutils').create(),
        testCases = {
            'an empty string': '',
            'a word':          'plop',
            'a null char':     'a\u0000',
            'an utf8 string':  'ÀÁÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ',
            'song lyrics':     ("Voilà l'été, j'aperçois le soleil\n" +
                                "Les nuages filent et le ciel s'éclaircit\n" +
                                "Et dans ma tête qui bourdonnent?\n" +
                                "Les abeilles!"),
            'a file contents': fs.read(phantom.kasperPath + '/tests/site/alert.html')
        };
    for (var what in testCases) {
        test.assertEquals(
            clientutils.decode(clientutils.encode(testCases[what])),
            testCases[what],
            'ClientUtils.encode() encodes and decodes ' + what
        );
    }
    test.done();
});

kasper.test.begin('ClientUtils.exists() tests', 5, function(test) {
    var clientutils = require('clientutils').create();
    fakeDocument('<ul class="foo"><li>bar</li><li>baz</li></ul>');
    test.assert(clientutils.exists('ul'),
        'ClientUtils.exists() checks that an element exist');
    test.assertNot(clientutils.exists('ol'),
        'ClientUtils.exists() checks that an element exist');
    test.assert(clientutils.exists('ul.foo li'),
        'ClientUtils.exists() checks that an element exist');
    // xpath
    test.assert(clientutils.exists(x('//ul')),
        'ClientUtils.exists() checks that an element exist using XPath');
    test.assertNot(clientutils.exists(x('//ol')),
        'ClientUtils.exists() checks that an element exist using XPath');
    fakeDocument(null);
    test.done();
});

kasper.test.begin('ClientUtils.findAll() tests', 7, function(test) {
    var clientutils = require('clientutils').create();
    fakeDocument('<ul class="foo"><li>bar</li><li>baz</li></ul>');
    test.assertType(clientutils.findAll('li'), 'nodelist',
        'ClientUtils.findAll() can find matching DOM elements');
    test.assertEquals(clientutils.findAll('li').length, 2,
        'ClientUtils.findAll() can find matching DOM elements');
    test.assertType(clientutils.findAll('ol'), 'nodelist',
        'ClientUtils.findAll() can find matching DOM elements');
    test.assertEquals(clientutils.findAll('ol').length, 0,
        'ClientUtils.findAll() can find matching DOM elements');
    // scoped
    var scope = clientutils.findOne('ul');
    test.assertType(clientutils.findAll('li', scope), 'nodelist',
        'ClientUtils.findAll() can find matching DOM elements within a given scope');
    test.assertEquals(clientutils.findAll('li', scope).length, 2,
        'ClientUtils.findAll() can find matching DOM elements within a given scope');
    test.assertType(clientutils.findAll(x('//li'), scope), 'array',
        'ClientUtils.findAll() can find matching DOM elements using XPath within a given scope');
    fakeDocument(null);
    test.done();
});

kasper.test.begin('ClientUtils.findOne() tests', 4, function(test) {
    var clientutils = require('clientutils').create();
    fakeDocument('<ul class="foo"><li>bar</li><li>baz</li></ul>');
    test.assertType(clientutils.findOne('ul'), 'htmlulistelement',
        'ClientUtils.findOne() can find a matching DOM element');
    test.assertNot(clientutils.findOne('ol'),
        'ClientUtils.findOne() can find a matching DOM element');
    // scoped
    var scope = clientutils.findOne('ul');
    test.assertType(clientutils.findOne('li', scope), 'htmllielement',
        'ClientUtils.findOne() can find a matching DOM element within a given scope');
    test.assertType(clientutils.findOne(x('//li'), scope), 'htmllielement',
        'ClientUtils.findOne() can find a matching DOM element using XPath within a given scope');
    fakeDocument(null);
    test.done();
});


kasper.test.begin('ClientUtils.processSelector() tests', 6, function(test) {
    var clientutils = require('clientutils').create();
    // CSS3 selector
    var cssSelector = clientutils.processSelector('html body > ul.foo li');
    test.assertType(cssSelector, 'object',
        'ClientUtils.processSelector() can process a CSS3 selector');
    test.assertEquals(cssSelector.type, 'css',
        'ClientUtils.processSelector() can process a CSS3 selector');
    test.assertEquals(cssSelector.path, 'html body > ul.foo li',
        'ClientUtils.processSelector() can process a CSS3 selector');
    // XPath selector
    var xpathSelector = clientutils.processSelector(x('//li[text()="blah"]'));
    test.assertType(xpathSelector, 'object',
        'ClientUtils.processSelector() can process a XPath selector');
    test.assertEquals(xpathSelector.type, 'xpath',
        'ClientUtils.processSelector() can process a XPath selector');
    test.assertEquals(xpathSelector.path, '//li[text()="blah"]',
        'ClientUtils.processSelector() can process a XPath selector');
    test.done();
});

kasper.test.begin('ClientUtils.getElementBounds() tests', 3, function(test) {
    kasper.start().then(function() {
        this.page.content = '<div id="b1" style="position:fixed;top:10px;left:11px;width:50px;height:60px"></div>';
        test.assertEquals(
            this.getElementBounds('#b1'),
            { top: 10, left: 11, width: 50, height: 60 },
            'ClientUtils.getElementBounds() retrieves element boundaries'
        );
    });
    kasper.then(function() {
        var html  = '<div id="boxes">';
            html += '  <div style="position:fixed;top:10px;left:11px;width:50px;height:60px"></div>';
            html += '  <div style="position:fixed;top:20px;left:21px;width:70px;height:80px"></div>';
            html += '</div>';
        this.page.content = html;
        var bounds = this.getElementsBounds('#boxes div');
        test.assertEquals(
            bounds[0],
            { top: 10, left: 11, width: 50, height: 60 },
            'ClientUtils.getElementsBounds() retrieves multiple elements boundaries'
        );
        test.assertEquals(
            bounds[1],
            { top: 20, left: 21, width: 70, height: 80 },
            'ClientUtils.getElementsBounds() retrieves multiple elements boundaries'
        );
    });
    kasper.run(function() {
        test.done();
    });
});

kasper.test.begin('ClientUtils.getElementInfo() tests', 10, function(test) {
    kasper.page.content = '<a href="plop" class="plip plup"><i>paf</i></a>';
    var info = kasper.getElementInfo('a.plip');
    test.assertEquals(info.nodeName, 'a', 'ClientUtils.getElementInfo() retrieves element name');
    test.assertEquals(info.attributes, {
        'href': 'plop',
        'class': 'plip plup'
    }, 'ClientUtils.getElementInfo() retrieves element attributes');
    test.assertEquals(info.html, '<i>paf</i>', 'ClientUtils.getElementInfo() retrieves element html content');
    test.assertEquals(info.text, 'paf', 'ClientUtils.getElementInfo() retrieves element text');
    test.assert(info.x > 0, 'ClientUtils.getElementInfo() retrieves element x pos');
    test.assert(info.y > 0, 'ClientUtils.getElementInfo() retrieves element y pos');
    test.assert(info.width > 0, 'ClientUtils.getElementInfo() retrieves element width');
    test.assert(info.height > 0, 'ClientUtils.getElementInfo() retrieves element height');
    test.assert(info.visible, 'ClientUtils.getElementInfo() retrieves element visibility');
    test.assertEquals(info.tag, '<a href="plop" class="plip plup"><i>paf</i></a>',
        'ClientUtils.getElementInfo() retrieves element whole tag contents');
    test.done();
});
