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

    casper.page.injectJs('http://code.jquery.com/jquery-1.7.min.js');

If you need jQuery being available everytime, you can also make it being
injected in every received response by setting the `clientScripts`
option of CasperJS:

```javascript
var casper = require('casper').create({
    clientScripts: ["includes/jquery.min.js"]
});
```

<span class="label label-info">Note</span> You can't *inject* scripts using the HTTP protocol, you actually have to use a relative/absolute filesystem path to the script resource.

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

<span class="label label-info">Tip</span> This is especially useful if you work
on Windows and don't have a way to use the Python-based `casperjs` executable
easily.

* * * * *

<h2 id="faq-httpstatuses">How can I catch HTTP 404 and other status codes?</h2>

You can define your own HTTP status code handlers by using the
`httpStatusHandlers` option of the Casper object. You can also catch
other HTTP status codes as well, as demoed below:

```javascript
var casper = require('casper').create({
    httpStatusHandlers: {
        404: function(self, resource) {
            self.echo(resource.url + ' not found (404)');
        },
        500: function(self, resource) {
            self.echo(resource.url + ' gave an error (500)');
        }
    },
    verbose: true
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

<span class="label label-info">Hint</span> As of 0.6, casper ships with a
complete [event system](#events-filters) and a bunch of these are dedicated to
HTTP statuses. You're encouraged to use them.
