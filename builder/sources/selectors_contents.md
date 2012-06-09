CasperJS makes an heavy use of selectors in order to work with the
[DOM](http://www.w3.org/TR/dom/), and can transparently use either
[CSS3](http://www.w3.org/TR/selectors/) or [XPath](http://www.w3.org/TR/xpath/)
expressions.

## CSS3 selectors

By default, Casper will accept [CSS3 selector strings](http://www.w3.org/TR/selectors/#selectors)
to check for elements within the DOM. For example, to check if a `<div id="plop">`
element exists in a page, you can use:

```javascript
casper.start('http://domain.tld/page.html', function() {
    casper.test.assertExists('#plop', 'the element exists');
});
```

## XPath

<span class="label label-success">Added in 0.6.8</span>
You can alternatively use [XPath expression strings]() instead:

```javascript
casper.thenOpen('http://domain.tld/page.html', function() {
    this.test.assertExists({
        type: 'xpath',
        path: '//*[@id="plop"]'
    }, 'the element exists');
});
```

To ease the use and reading of XPath expressions, a `selectXPath` helper is
available from the `casper` module:

```javascript
var x = require('casper').selectXPath;

casper.thenOpen('http://domain.tld/page.html', function() {
    this.test.assertExists(x('//*[@id="plop"]'), 'the element exists');
});
```

<span class="label label-warning">Warning</span> The only limitation of XPath use
in CasperJS is in the [`fill()`](api.html#casper.fill) method when you want to fill
**file fields**; PhantomJS natively only allows the use of CSS3 selectors in
<a href="http://code.google.com/p/phantomjs/wiki/Interface#uploadFile(selector,_fileName)">its
uploadFile method</a>, hence this limitation.
