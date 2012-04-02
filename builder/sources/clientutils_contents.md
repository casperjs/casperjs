Casper ships with a few client-side utilities which are injected in the
remote DOM environment, and accessible from there through the
`__utils__` object instance of the `ClientUtils` class of the
`clientutils` module.

<span class="label label-info">Note</span> These tools are provided to avoid
coupling CasperJS to any third-party library like jQuery, Mootools or
something; but you can always include these and have them available client-side
using the `Casper.options.clientScripts` option.

<h3  id="phantom_Casper_ClientUtils_encode"><code>ClientUtils#encode(String contents)</code></h3>

Encodes a string using the [base64
algorithm](http://en.wikipedia.org/wiki/Base64). For the records,
CasperJS doesn't use builtin `window.btoa()` function because it can't
deal efficiently with strings encoded using \>8b characters.

```javascript
var base64;
casper.start('http://foo.bar/', function() {
    base64 = this.evaluate(function() {
        return __utils__.encode("I've been a bit cryptic recently");
    };
});

casper.run(function() {
    this.echo(base64).exit();
});
```

<h3  id="phantom_Casper_ClientUtils_exists"><code>ClientUtils#exists(String selector)</code></h3>

Checks if a DOM element matching a given CSS3 selector exists.

```javascript
var exists;
casper.start('http://foo.bar/', function() {
    exists = this.evaluate(function() {
        return __utils__.exists('#some_id');
    };
});

casper.run(function() {
    this.echo(exists).exit();
});
```

<h3  id="phantom_Casper_ClientUtils_findAll"><code>ClientUtils#findAll(String selector)</code></h3>

Retrieves all DOM elements matching a given CSS3 selector.

```javascript
var links;
casper.start('http://foo.bar/', function() {
    links = this.evaluate(function() {
        var elements = __utils__.findAll('a.menu');
        return Array.prototype.forEach.call(elements, function(e) {
            return e.getAttribute('href');
        });
    };
});

casper.run(function() {
    this.echo(JSON.stringify(links)).exit();
});
```

<h3  id="phantom_Casper_ClientUtils_findOne"><code>ClientUtils#findOne(String selector)</code></h3>

Retrieves a single DOM element by a CSS3 selector.

```javascript
var href;
casper.start('http://foo.bar/', function() {
    href = this.evaluate(function() {
        return __utils__.findOne('#my_id').getAttribute('href');
    };
});

casper.run(function() {
    this.echo(href).exit();
});
```

<h3  id="phantom_Casper_ClientUtils_getBase64"><code>ClientUtils#getBase64(String url[, String method, Object data])</code></h3>

This method will retrieved a base64 encoded version of any resource
behind an url. For example, let's imagine we want to retrieve the base64
representation of some website's logo:

```javascript
var logo = null;
casper.start('http://foo.bar/', function() {
    logo = this.evaluate(function() {
        var imgUrl = document.querySelector('img.logo').getAttribute('src');
        return __utils__.getBase64(imgUrl);
    };
});

casper.run(function() {
    this.echo(logo).exit();
});
```

<h3  id="phantom_Casper_ClientUtils_getBinary"><code>ClientUtils#getBinary(String url[, String method, Object data])</code></h3>

This method will retrieved the raw contents of a given binary resource;
unfortunately though, PhantomJS cannot process these data directly so
you'll have to process them within the remote DOM environment. If you
intend to download the resource, use
[ClientUtils.getBase64()](#phantom_Casper_ClientUtils_getBase64) or
[Casper.base64encode()](#phantom_Casper_base64encode) instead.

```javascript
casper.start('http://foo.bar/', function() {
    this.evaluate(function() {
        var imgUrl = document.querySelector('img.logo').getAttribute('src');
        console.log(__utils__.getBinary(imgUrl));
    };
});

casper.run();
```

Warning You won't be able to pass the *binary string* from the remote
DOM environment to PhantomJS' one. For retrieving binary contents, use
[`ClientUtils.encode()`](#phantom_Casper_ClientUtils_encode).

<h3  id="phantom_Casper_ClientUtils_visible"><code>ClientUtils#visible(String selector)</code></h3>

Checks if an element is visible.

```javascript
casper.start('http://foo.bar/', function() {
    if (this.visible('#cain')) {
        this.echo("I CAN SEE YOU");
    }
});

casper.run();
```
