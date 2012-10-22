Here's a selection of the most frequently asked questions by casperjs
newcomers.

<h2 id="faq-help">I'm stuck! What can I do?</h2>

Your best bet is probably to ask for help on the [CasperJS discussion
group](https://groups.google.com/forum/#!forum/casperjs)

* * * * *

<h2 id="faq-versioning">What is the versioning policy of CasperJS?</h2>

Releases will follow the [SemVer standard](http://semver.org/); they
will be numbered with the follow format:

```
<major>.<minor>.<patch>[-<identifier>]
```

And constructed with the following guidelines:

- Breaking backwards compatibility bumps the major
- New additions without breaking backwards compatibility bumps the minor
- Bug fixes and misc changes bump the patch
- Unstable, special and trunk versions will have a proper identifier

* * * * *

<h2 id="faq-typeerror">I'm getting *TypeError: 'undefined' is not a function*; WTF?</h2>

Unfortunately PhantomJS ships with a QtWebKit JS engine which would
[need](http://code.google.com/p/phantomjs/issues/detail?id=336) quite a
serious upgrade to have more explicit error messages, stack traces,
location, etc.

I cannot do much to make the situation really better, unfortunately :/

* * * * *

<h2 id="faq-jquery">Can I use [jQuery](http://jquery.com/) with CasperJS?</h2>

Sure, as every single other javascript library on Earth.

A first solution is to inject it into the remote DOM environment by
hand using the standard `WebPage.injectJs()` method:

```javascript
casper.page.injectJs('/path/to/jquery.js');
```

If you need jQuery being available everytime, you can also make it being
injected in every received response by setting the `clientScripts`
option of CasperJS:

```javascript
var casper = require('casper').create({
    clientScripts: ["includes/jquery.min.js"]
});
```

<span class="label label-info">Note</span>
You can't *inject* scripts using the HTTP protocol, you actually have to use
a relative/absolute filesystem path to the script resource.

* * * * *

<h2 id="faq-executable">Can I use CasperJS without using the `casperjs` executable?</h2>

Yes, you can call a CasperJS script directly with the `phantomjs`
executable, but if you do so, you must set the `phantom.casperPath`
property to the path where the library root is located on your system:

```javascript
// casperscript.js
phantom.casperPath = '/path/to/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('casper').create();
// ...
```

You can run such a script like any other standard PhantomJS script:

```
$ phantomjs casperscript.js
```

**If you're on Windows**, this is the way you may manage to get casper working
the most easily:

```javascript
phantom.casperPath = 'C:\\path\\to\\your\\repo\\lib\\casperjs-0.6.X';
phantom.injectJs(phantom.casperPath + '\\bin\\bootstrap.js');

var casper = require('casper').create();

// do stuff
```

* * * * *

<h2 id="faq-httpstatuses">How can I catch HTTP 404 and other status codes?</h2>

You can define your own
[HTTP status code](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
handlers by using the `httpStatusHandlers` option of the Casper object. You can
also catch other HTTP status codes as well, as demoed below:

```javascript
var casper = require('casper').create();

casper.on('http.status.404', function(resource) {
    this.echo('wait, this url is 404: ' + resource.url);
});

casper.on('http.status.500', function(resource) {
    this.echo('woops, 500 error: ' + resource.url);
});

casper.start('http://mywebsite/404', function() {
    this.echo('We suppose this url return an HTTP 404');
});

casper.thenOpen('http://mywebsite/500', function() {
    this.echo('We suppose this url return an HTTP 500');
});

casper.run(function() {
    this.echo('Done.').exit();
});
```

<span class="label label-info">Hint</span>
Check out all the other cool [events](events-filters.html) you may use as well.

* * * * *

<h2 id="faq-utils">What's this mysterious `__utils__` object?</h2>

The `__utils__` object is actually an instance of the [`ClientUtils`](api.html#client-utils) class which
have been automatically injected into the page DOM and is therefore always available.

So everytime to perform an [`evaluate()`](api.html#casper.evaluate) call, you have this instance available
to perform common operations like:

- fetching nodes using CSS3 or XPath selectors,
- retrieving information about element properties (attributes, size, bounds, etc.),
- sending AJAX requests,
- triggering DOM events

Check out the [whole API](api.html#client-utils). You even have
[a bookmarklet](api.html#bookmarklet) to play around with this `__utils__` instance
right within your browser console!

<span class="label label-info">Note</span> You're not obliged at all to use the `__utils__`
instance in your scripts. It's just there because it's used by CasperJS internals.
