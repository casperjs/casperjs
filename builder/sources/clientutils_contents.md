Casper ships with a few client-side utilities which are injected in the
remote DOM environment, and accessible from there through the
`__utils__` object instance of the `ClientUtils` class of the
`clientutils` module.

<span class="label label-info">Note</span> These tools are provided to avoid
coupling CasperJS to any third-party library like jQuery, Mootools or
something; but you can always include these and have them available client-side
using the `Casper.options.clientScripts` option.

<h2 id="bookmarklet">Bookmarlet</h2>

A bookmarklet is also available to help injecting Casper's client-side
utilities in the DOM of your favorite browser.

Just drag this link
<span class="label label-info"><a href="javascript:void(function()%7Bif(!document.getElementById('CasperUtils'))%7Bvar%20CasperUtils=document.createElement('script');CasperUtils.id='CasperUtils';CasperUtils.src='https://raw.github.com/n1k0/casperjs/master/modules/clientutils.js';document.documentElement.appendChild(CasperUtils);%7D%7D());">CasperJS utils</a></span>
onto your favorites toobar; when clicking, a <code>\_\_utils\__</code> object will
be available within the console of your browser.

<span class="label label-info">Note</span> CasperJS and PhantomJS being based
on Webkit, you're strongly encouraged to use a recent Webkit compatible browser
to use this bookmarklet (Chrome, Safari, etc…)

<h3 id="clientutils.encode"><code>ClientUtils#encode(String contents)</code></h3>

Encodes a string using the [base64
algorithm](http://en.wikipedia.org/wiki/Base64). For the records,
CasperJS doesn't use builtin `window.btoa()` function because it can't
deal efficiently with strings encoded using \>8b characters.

```javascript
var base64;
casper.start('http://foo.bar/', function() {
    base64 = this.evaluate(function() {
        return __utils__.encode("I've been a bit cryptic recently");
    });
});

casper.run(function() {
    this.echo(base64).exit();
});
```

<h3 id="clientutils.exists"><code>ClientUtils#exists(String selector)</code></h3>

Checks if a DOM element matching a given [selector expression](selectors.html) exists.

```javascript
var exists;
casper.start('http://foo.bar/', function() {
    exists = this.evaluate(function() {
        return __utils__.exists('#some_id');
    });
});

casper.run(function() {
    this.echo(exists).exit();
});
```

<h3 id="clientutils.findAll"><code>ClientUtils#findAll(String selector)</code></h3>

Retrieves all DOM elements matching a given [selector expression](selectors.html).

```javascript
var links;
casper.start('http://foo.bar/', function() {
    links = this.evaluate(function() {
        var elements = __utils__.findAll('a.menu');
        return Array.prototype.forEach.call(elements, function(e) {
            return e.getAttribute('href');
        });
    });
});

casper.run(function() {
    this.echo(JSON.stringify(links)).exit();
});
```

<h3 id="clientutils.findOne"><code>ClientUtils#findOne(String selector)</code></h3>

Retrieves a single DOM element by a [selector expression](selectors.html).

```javascript
var href;
casper.start('http://foo.bar/', function() {
    href = this.evaluate(function() {
        return __utils__.findOne('#my_id').getAttribute('href');
    });
});

casper.run(function() {
    this.echo(href).exit();
});
```

<h3 id="clientutils.getBase64"><code>ClientUtils#getBase64(String url[, String method, Object data])</code></h3>

This method will retrieved a base64 encoded version of any resource
behind an url. For example, let's imagine we want to retrieve the base64
representation of some website's logo:

```javascript
var logo = null;
casper.start('http://foo.bar/', function() {
    logo = this.evaluate(function() {
        var imgUrl = document.querySelector('img.logo').getAttribute('src');
        return __utils__.getBase64(imgUrl);
    });
});

casper.run(function() {
    this.echo(logo).exit();
});
```

<h3 id="clientutils.getBinary"><code>ClientUtils#getBinary(String url[, String method, Object data])</code></h3>

This method will retrieved the raw contents of a given binary resource;
unfortunately though, PhantomJS cannot process these data directly so
you'll have to process them within the remote DOM environment. If you
intend to download the resource, use
[ClientUtils.getBase64()](#clientutils.getBase64) or
[Casper.base64encode()](api.html#casper.base64encode) instead.

```javascript
casper.start('http://foo.bar/', function() {
    this.evaluate(function() {
        var imgUrl = document.querySelector('img.logo').getAttribute('src');
        console.log(__utils__.getBinary(imgUrl));
    });
});

casper.run();
```

<h3 id="clientutils.getElementByXPath"><code>ClientUtils#getElementByXPath(String expression)</code></h3>

Retrieves a single DOM element matching a given [XPath expression](http://www.w3.org/TR/xpath/).

<h3 id="clientutils.getElementsByXPath"><code>ClientUtils#getElementsByXPath(String expression)</code></h3>

Retrieves all DOM elements matching a given [XPath expression](http://www.w3.org/TR/xpath/), if any.

<h3 id="clientutils.mouseEvent"><code>ClientUtils#mouseEvent(String type, String selector)</code></h3>

Dispatches a mouse event to the DOM element behind the provided selector.

Supported events are `mouseup`, `mousedown`, `click`, `mousemove`, `mouseover` and `mouseout`.

<h3 id="clientutils.removeElementsByXPath"><code>ClientUtils#removeElementsByXPath(String expression)</code></h3>

Removes all DOM elements matching a given [XPath expression](http://www.w3.org/TR/xpath/).

<h3 id="clientutils.visible"><code>ClientUtils#visible(String selector)</code></h3>

Checks if an element is visible.

```javascript
var logoIsVisible = casper.evaluate(function() {
    return __utils__.visible('h1');
});
```
