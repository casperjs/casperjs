Casper source code is quite heavily documented using `jsdoc`, but below
you'll find the whole API documentation with sample code.

The Casper class
----------------

The most easy way to instantiate a casper instance is to use the
module's `create()` method:

```javascript
var casper = require('casper').create();
```

But you can also retrieve the main Function and instantiate it by
yourself:

```javascript
var casper = new require('casper').Casper();
```

<span class="label label-info">Hint</span>
Also, check out [how to extend Casper with your own methods](extending.html).

<h3 id="casper.options"><code>Casper([Object options])</code></h3>

Both the `Casper` constructor and the `create()` function accept a
single `options` argument which is a standard javascript object:

```javascript
var casper = require('casper').create({
    verbose: true,
    logLevel: "debug"
});
```

## Casper options

All the available options are detailed below:

<table class="table table-striped table-condensed" caption="Casper options">
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>clientScripts</code></td>
      <td><code>Array</code></td>
      <td><code>[]</code></td>
      <td>
        A collection of script filepaths to include to every
        page loaded
      </td>
    </tr>
    <tr>
      <td><code>exitOnError</code></td>
      <td><code>Boolean</code></td>
      <td><code>true</code></td>
      <td>
        Sets if CasperJS must exit when an uncaught error has been thrown by
        the script.
      </td>
    </tr>
    <tr>
      <td><code>httpStatusHandlers</code></td>
      <td><code>Object</code></td>
      <td><code>{}</code></td>
      <td>
        A javascript Object containing functions to call when a
        requested resource has a given HTTP status code. A
        <a href="https://github.com/n1k0/casperjs/blob/master/samples/statushandlers.js">dedicated
        sample</a> is provided as an example.
      </td>
    </tr>
    <tr>
      <td><code>logLevel</code></td>
      <td><code>String</code></td>
      <td><code>"error"</code></td>
      <td>
        Logging level (see the <a href="logging.html">logging
        section</a> for more information)
      </td>
    </tr>
    <tr>
      <td><code>onAlert</code></td>
      <td><code>Function</code></td>
      <td><code>null</code></td>
      <td>
        A function to be called when a javascript <code>alert()</code>
        is triggered
      </td>
    </tr>
    <tr>
      <td><code>onDie</code></td>
      <td><code>Function</code></td>
      <td><code>null</code></td>
      <td>
        A function to be called when <code>Casper#die()</code>
        is called
      </td>
    </tr>
    <tr>
      <td><code>onError</code></td>
      <td><code>Function</code></td>
      <td><code>null</code></td>
      <td>
        A function to be called when an <code>"error"</code>
        level event occurs
      </td>
    </tr>
    <tr>
      <td><code>onLoadError</code></td>
      <td><code>Function</code></td>
      <td><code>null</code></td>
      <td>
        A function to be called when a requested resource cannot
        be loaded
      </td>
    </tr>
    <tr>
      <td><code>onPageInitialized</code></td>
      <td><code>Function</code></td>
      <td><code>null</code></td>
      <td>A function to be called after <code>WebPage</code>
        instance has been initialized</td>
    </tr>
    <tr>
      <td><code>onResourceReceived</code></td>
      <td><code>Function</code></td>
      <td><code>null</code></td>
      <td>
        Proxy method for PhantomJS' <code>WebPage#onResourceReceived()</code>
        callback, but the current Casper instance is passed as
        first argument.
      </td>
    </tr>
    <tr>
      <td><code>onResourceRequested</code></td>
      <td><code>Function</code></td>
      <td><code>null</code></td>
      <td>
        Proxy method for PhantomJS' <code>WebPage#onResourceRequested()</code>
        callback, but the current Casper instance is passed as
        first argument.
      </td>
    </tr>
    <tr>
      <td><code>onStepComplete</code></td>
      <td><code>Function</code></td>
      <td><code>null</code></td>
      <td>A function to be executed when a step function execution
        is finished.</td>
    </tr>
    <tr>
      <td><code>onStepTimeout</code></td>
      <td><code>Function</code></td>
      <td><code>null</code></td>
      <td> A function to be executed when a step function
        execution time exceeds the value of the <code>stepTimeout</code>
        option, if any has been set. </td>
    </tr>
    <tr>
      <td><code>onTimeout</code></td>
      <td><code>Function</code></td>
      <td><code>null</code></td>
      <td> A function to be executed when script execution time
        exceeds the value of the <code>timeout</code> option, if
        any has been set. </td>
    </tr>
    <tr>
      <td><code>page</code></td>
      <td><code>WebPage</code></td>
      <td><code>null</code></td>
      <td>An existing <code>WebPage</code> instance</td>
    </tr>
    <tr>
      <td><code>pageSettings</code></td>
      <td><code>Object</code></td>
      <td><code>{}</code></td>
      <td>
        <p>
          PhantomJS's <code>WebPage</code> settings object.
          <a href="http://code.google.com/p/phantomjs/wiki/Interface#settings_(object)">Available settings</a> are:
        </p>
        <ul>
          <li>
            <code>javascriptEnabled</code> defines whether to execute the
            script in the page or not (default to true)
          </li>
          <li>
            <code>loadImages</code> defines whether to load the inlined images
            or not
          </li>
          <li>
            <code>loadPlugins</code> defines whether to load NPAPI plugins
            (Flash, Silverlight, ...) or not
          </li>
          <li>
            <code>localToRemoteUrlAccessEnabled</code> defines whether local
            resource (e.g. from file) can access remote URLs or not (default to false)
          </li>
          <li>
            <code>userAgent</code> defines the user agent sent to server when
            the web page requests resources.
          </li>
          <li>
            <code>userName</code> sets the user name used for HTTP
            authentication
          </li>
          <li>
            <code>password</code> sets the password used for HTTP
            authentication
          </li>
          <li>
            <code>XSSAuditingEnabled</code> defines whether load requests
            should be monitored for cross-site scripting attempts (default to
              false)
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>safeLogs</code></td>
      <td><code>Boolean</code></td>
      <td><code>true</code></td>
      <td>
        <span class="label label-success">Added in 1.0</span>
        When this option is set to <code>true</code>&nbsp;— which is the
        default, any password information entered in
        <code>&lt;input type="password"&gt;</code> will be obfuscated in log
        messages. Set <code>safeLogs</code> to false to disclose passwords in
        plain text <strong>(not recommended)</strong>.
      </td>
    </tr>
    <tr>
      <td><code>stepTimeout</code></td>
      <td><code>Number</code></td>
      <td><code>null</code></td>
      <td> Max step timeout in milliseconds; when set, every
        defined step function will have to execute before this
        timeout value has been reached. You can define the <code>onStepTimeout()</code>
        callback to catch such a case. By default, the script will
        <code>die()</code> with an error message. </td>
    </tr>
    <tr>
      <td><code>timeout</code></td>
      <td><code>Number</code></td>
      <td><code>null</code></td>
      <td>Max timeout in milliseconds</td>
    </tr>
    <tr>
      <td><code>verbose</code></td>
      <td><code>Boolean</code></td>
      <td><code>false</code></td>
      <td>Realtime output of log messages</td>
    </tr>
    <tr>
      <td><code>viewportSize</code></td>
      <td><code>Object</code></td>
      <td><code>null</code></td>
      <td>Viewport size, eg. <code>{width: 800, height: 600}</code></td>
    </tr>
  </tbody>
</table>

**Example:**

```javascript
var casper = require('casper').create({
    clientScripts:  [
        'includes/jquery.js',      // These two scripts will be injected in remote
        'includes/underscore.js'   // DOM on every request
    ],
    logLevel: "info",              // Only "info" level messages will be logged
    onError: function(self, m) {   // Any "error" level message will be written
        console.log('FATAL:' + m); // on the console output and PhantomJS will
        self.exit();               // terminate
    },
    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: false         // use these settings
    }
});
```

But no worry, usually you'll just need to instantiate Casper using
`require('casper').create()`.

<h3 id="casper.back"><code>Casper#back()</code></h3>

Moves back a step in browser's history.

```javascript
casper.start('http://foo.bar/1')
casper.thenOpen('http://foo.bar/2');
casper.thenOpen('http://foo.bar/3');
casper.back();
casper.run(function() {
    console.log(this.getCurrentUrl()); // 'http://foo.bar/2'
});
```

Also have a look at [`Casper.forward()`](#forward).

<h3 id="casper.base64encode"><code>Casper#base64encode(String url [, String method, Object data])</code></h3>

Encodes a resource using the base64 algorithm synchronously using
client-side XMLHttpRequest.

<span class="label label-info">Note</span> We cannot use `window.btoa()`
because it fails miserably in the version of WebKit shipping with PhantomJS.

Example: retrieving google logo image encoded in base64:

```javascript
var base64logo = null;
casper.start('http://www.google.fr/', function() {
    base64logo = this.base64encode('http://www.google.fr/images/srpr/logo3w.png');
});

casper.run(function() {
    this.echo(base64logo).exit();
});
```

You can also perform an HTTP POST request to retrieve the contents to
encode:

```javascript
var base46contents = null;
casper.start('http://domain.tld/download.html', function() {
    base46contents = this.base64encode('http://domain.tld/', 'POST', {
        param1: 'foo',
        param2: 'bar'
    });
});
```

```javascript
casper.run(function() {
    this.echo(base46contents).exit();
});
```

<h3 id="casper.click"><code>Casper#click(String <a href="selectors.html">selector</a>)</code></h3>

Performs a click on the element matching the provided [selector expression](selectors.html).
The method tries two strategies sequentially:

1. trying to trigger a MouseEvent in Javascript
2. using native QtWebKit event if the previous attempt failed

Example:

```javascript
casper.start('http://google.fr/');

casper.thenEvaluate(function(term) {
    document.querySelector('input[name="q"]').setAttribute('value', term);
    document.querySelector('form[name="f"]').submit();
}, { term: 'CasperJS' });

casper.then(function() {
    // Click on 1st result link
    this.click('h3.r a');
});

casper.then(function() {
    console.log('clicked ok, new location is ' + this.getCurrentUrl());
});

casper.run();
```

<h3 id="casper.clickLabel"><code>Casper#clickLabel(String label[, String tag])</code></h3>

<span class="label label-success">Added in 0.6.10</span>
Clicks on the first DOM element found containing `label` text.
Optionaly ensures that the element node name is `tag`.

```javascript
// <a href="...">My link is beautiful</a>
casper.then(function() {
    this.clickLabel('My link is beautiful', 'a');
});

// <button type="submit">But my button is sexier</button>
casper.then(function() {
    this.clickLabel('But my button is sexier', 'button');
});
```

<h3 id="casper.capture"><code>Casper#capture(String targetFilepath, Object clipRect)</code></h3>

Proxy method for PhantomJS' `WebPage#render`. Adds a clipRect parameter
for automatically setting page clipRect setting values and sets it back
once done.

**Example:**

```javascript
casper.start('http://www.google.fr/', function() {
    this.capture('google.png', {
        top: 100,
        left: 100,
        width: 500,
        height: 400
    });
});

casper.run();
```

<h3 id="casper.captureBase64"><code>Casper#captureBase64(String format[, Mixed area])</code></h3>

<span class="label label-success">Added in 0.6.5</span>
<span class="label label-info">PhantomJS >= 1.6</span>
Computes the [Base64](http://en.wikipedia.org/wiki/Base64) representation of a
binary image capture of the current page, or an area within the page, in a
given format.

Supported image formats are `bmp`, `jpg`, `jpeg`, `png`, `ppm`, `tiff`,
`xbm` and `xpm`.

The `area` argument can be either of the following types:

- `String`: area is a CSS3 selector string, eg. `div#plop form[name="form"] input[type="submit"]`
- `clipRect`: area is a clipRect object, eg. `{"top":0,"left":0,"width":320,"height":200}`
- `Object`: area is a [selector object](selectors.html), eg. an XPath selector

**Example:**

```javascript
casper.start('http://google.com', function() {
    // selector capture
    console.log(this.captureBase64('png', '#lga'));
    // clipRect capture
    console.log(this.captureBase64('png', {
        top: 0,
        left: 0,
        width: 320,
        height: 200
    }));
    // whole page capture
    console.log(this.captureBase64('png'));
});

casper.run();
```

<h3 id="casper.captureSelector"><code>Casper#captureSelector(String targetFile, String <a href="selectors.html">selector</a>)</code></h3>

Captures the page area containing the provided selector.

**Example:**

```javascript
casper.start('http://www.weather.com/', function() {
    this.captureSelector('weather.png', '.twc-story-block');
});

casper.run();
```

<h3 id="casper.clear"><code>Casper#clear()</code></h3>

<span class="label label-success">Added in 0.6.5</span>
Clears the current page execution environment context. Useful to avoid
having previously loaded DOM contents being still active.

Think of it as a way to stop javascript execution within the remote DOM
environment.

**Example:**

```javascript
casper.start('http://www.google.fr/', function() {
    this.clear(); // javascript execution in this page has been stopped
});

casper.then(function() {
    // ...
});

casper.run();
```

<h3 id="casper.debugHTML"><code>Casper#debugHTML()</code></h3>

Logs the HTML code of the current page directly to the standard output,
for debugging purpose.

**Example:**

```javascript
casper.start('http://www.google.fr/', function() {
    this.debugHTML();
});

casper.run();
```

<h3 id="casper.debugPage"><code>Casper#debugPage()</code></h3>

Logs the textual contents of the current page directly to the standard
output, for debugging purpose.

**Example:**

```javascript
casper.start('http://www.google.fr/', function() {
    this.debugPage();
});

casper.run();
```

<h3 id="casper.die"><code>Casper#die(String message[, int  status])</code></h3>

Exits phantom with a logged error message and an optional exit status
code.

**Example:**

```javascript
casper.start('http://www.google.fr/', function() {
    this.die("Fail.", 1);
});

casper.run();
```

<h3 id="casper.download"><code>Casper#download(String url, String target[, String method, Object data])</code></h3>

Saves a remote resource onto the filesystem. You can optionally set the HTTP
method using the `method` argument, and pass request arguments through the
`data` object (see [base64encode](api.html#casper.base64encode)).

```javascript
casper.start('http://www.google.fr/', function() {
    var url = 'http://www.google.fr/intl/fr/about/corporate/company/';
    this.download(url, 'google_company.html');
});

casper.run(function() {
    this.echo('Done.').exit();
});
```

<h3 id="casper.each"><code>Casper#each(Array array, Function fn)</code></h3>

Iterates over provided array items and execute a callback.

**Example:**

```javascript
var links = [
    'http://google.com/',
    'http://yahoo.com/',
    'http://bing.com/'
];

casper.start().each(links, function(self, link) {
    self.thenOpen(link, function() {
        this.echo(this.getTitle());
    });
});

casper.run();
```

<span class="label label-info">Hint</span> Have a look at the
[googlematch.js](https://github.com/n1k0/casperjs/blob/master/samples/googlematch.js)
sample script for a concrete use case.

<h3 id="casper.echo"><code>Casper#echo(String message[, String style])</code></h3>

Prints something to stdout, optionally with some fancy color (see the
[`Colorizer`](colorizer.html) section of this document for more
information).

**Example:**

```javascript
casper.start('http://www.google.fr/', function() {
    this.echo('Page title is: ' + this.evaluate(function() {
        return document.title;
    }), 'INFO'); // Will be printed in green on the console
});

casper.run();
```

<h3 id="casper.evaluate"><code>Casper#evaluate(Function fn[, Object replacements])</code></h3>

Evaluates an expression **in the remote page context**, a bit like what PhantomJS'
`WebPage#evaluate` does, but can also handle passed arguments if you
define their context:

**Example:**

```javascript
casper.evaluate(function(username, password) {
    document.querySelector('#username').value = username;
    document.querySelector('#password').value = password;
    document.querySelector('#submit').click();
}, {
    username: 'sheldon.cooper',
    password: 'b4z1ng4'
});
```

<span class="label label-info">Note</span> For filling and submitting forms, rather use the
[`Casper#fill()`](#casper.fill) method.

<span class="label label-info">Note</span> The concept behind this method is
probably the most difficult to understand when discovering CasperJS.
As a reminder, think of the `evaluate()` method as a *gate* between the CasperJS
environment and the one of the page you have opened; everytime you pass a closure to
`evaluate()`, you're entering the page and execute code as if you were using the
browser console.

Here's a quickly drafted diagram trying to basically explain the separation of
concerns:

![diagram](images/evaluate-diagram.png)

<h3 id="casper.evaluateOrDie"><code>Casper#evaluateOrDie(Function fn[, String message])</code></h3>

Evaluates an expression within the current page DOM and `die()` if it
returns anything but `true`.

**Example:**

```javascript
casper.start('http://foo.bar/home', function() {
    this.evaluateOrDie(function() {
        return /logged in/.match(document.title);
    }, 'not authenticated');
});

casper.run();
```

<h3 id="casper.exit"><code>Casper#exit([int status])</code></h3>

Exits PhantomJS with an optional exit status code.

<h3 id="casper.exists"><code>Casper#exists(String <a href="selectors.html">selector</a>)</code></h3>

Checks if any element within remote DOM matches the provided
[selector](selectors.html).

```javascript
casper.start('http://foo.bar/home', function() {
    if (this.exists('#my_super_id')) {
        this.echo('found #my_super_id', 'INFO');
    } else {
        this.echo('#my_super_id not found', 'ERROR');
    }
});

casper.run();
```

<h3 id="casper.fetchText"><code>Casper#fetchText(String <a href="selectors.html">selector</a>)</code></h3>

Retrieves text contents matching a given [selector expression](selectors.html).
If you provide one matching more than one element, their textual contents will
be concatenated.

```javascript
casper.start('http://google.com/search?q=foo', function() {
    this.echo(this.fetchText('h3'));
}).run();
```

<h3 id="casper.forward"><code>Casper#forward()</code></h3>

Moves a step forward in browser's history.

```javascript
casper.start('http://foo.bar/1')
casper.thenOpen('http://foo.bar/2');
casper.thenOpen('http://foo.bar/3');
casper.back();    // http://foo.bar/2
casper.back();    // http://foo.bar/1
casper.forward(); // http://foo.bar/2
casper.run();
```

Also have a look at [`Casper.back()`](#back).

<h3 id="casper.log"><code>Casper#log(String message[, String level, String space])</code></h3>

Logs a message with an optional level in an optional space. Available
levels are `debug`, `info`, `warning` and `error`. A space is a kind of
namespace you can set for filtering your logs. By default, Casper logs
messages in two distinct spaces: `phantom` and `remote`, to distinguish
what happens in the PhantomJS environment from the remote one.

**Example:**

```javascript
casper.start('http://www.google.fr/', function() {
    this.log("I'm logging an error", "error");
});

casper.run();
```

<h3 id="casper.fill"><code>Casper#fill(String <a href="selectors.html">selector</a>,  Object values[, Boolean submit])</code></h3>

Fills the fields of a form with given values and optionally submits it.

Example with this sample html form:

```html
<form action="/contact" id="contact-form" enctype="multipart/form-data">
    <input type="text" name="subject"/>
    <textearea name="content"></textearea>
    <input type="radio" name="civility" value="Mr"/> Mr
    <input type="radio" name="civility" value="Mrs"/> Mrs
    <input type="text" name="name"/>
    <input type="email" name="email"/>
    <input type="file" name="attachment"/>
    <input type="checkbox" name="cc"/> Receive a copy
    <input type="submit"/>
</form>
```

A script to fill and submit this form:

```javascript
casper.start('http://some.tld/contact.form', function() {
    this.fill('form#contact-form', {
        'subject':    'I am watching you',
        'content':    'So be careful.',
        'civility':   'Mr',
        'name':       'Chuck Norris',
        'email':      'chuck@norris.com',
        'cc':         true,
        'attachment': '/Users/chuck/roundhousekick.doc'
    }, true);
});

casper.then(function() {
    this.evaluateOrDie(function() {
        return /message sent/.test(document.body.innerText);
    }, 'sending message failed');
});

casper.run(function() {
    this.echo('message sent').exit();
});
```

Please Don't use CasperJS nor PhantomJS to send spam, or I'll be calling
the Chuck. More seriously, please just don't.

<span class="label label-warning">Warning</span> The `fill()` method currently
can't fill **file fields using XPath selectors**; PhantomJS natively only allows
the use of CSS3 selectors in
<a href="http://code.google.com/p/phantomjs/wiki/Interface#uploadFile(selector,_fileName)">its
uploadFile method</a>, hence this limitation.

<h3 id="casper.getCurrentUrl"><code>Casper#getCurrentUrl()</code></h3>

Retrieves current page URL. <span class="label label-info">Note</span> the url
will be url-decoded.

**Example:**

```javascript
casper.start('http://www.google.fr/', function() {
    this.echo(this.getCurrentUrl()); // "http://www.google.fr/"
});

casper.run();
```

<h3 id="casper.getElementAttribute"><code>Casper#getElementAttribute(String <a href="selectors.html">selector</a>, String attribute)</code></h3>

<span class="label label-success">Added in 1.0</span>
Retrieves the value of an attribute on the first element matching the provided
[selector](selectors.html).

**Example:**

```javascript
var casper = require('casper').create();

casper.start('http://www.google.fr/', function() {
    require('utils').dump(this.getElementAttribute('div[title="Google"]', 'title')); // "Google"
});

casper.run();
```

<h3 id="casper.getElementBounds"><code>Casper#getElementBounds(String <a href="selectors.html">selector</a>)</code></h3>

Retrieves boundaries for a DOM element matching the provided
[selector](selectors.html).

It returns an Object with four keys: `top`, `left`, `width` and `height`, or
`null` if the selector doesn't exist.

**Example:**

```javascript
var casper = require('casper').create();

casper.start('http://www.google.fr/', function() {
    require('utils').dump(this.getElementBounds('div[title="Google"]'));
});

casper.run();
```

This will output something like:

```
{
    "height": 95,
    "left": 352,
    "top": 16,
    "width": 275
}
```

<h3 id="casper.getGlobal"><code>Casper#getGlobal(String name)</code></h3>

Retrieves a global variable value within the remote DOM environment by
its name. Basically, `getGlobal('foo')` will retrieve the value of `window.foo`
from the page.

**Example:**

```javascript
casper.start('http://www.google.fr/', function() {
    this.echo(this.getGlobal('innerWidth')); // 1024
});

casper.run();
```

<h3 id="casper.getPageContent"><code>Casper#getPageContent()</code></h3>

<span class="label label-success">Added in 1.0.0</span>
Retrieves current page contents, dealing with exotic other content types than HTML.

**Example:**

```javascript
var casper = require('casper').create();

casper.start().then(function() {
    this.open('http://search.twitter.com/search.json?q=casperjs', {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    });
});

casper.run(function() {
    require('utils').dump(JSON.parse(this.getPageContent()));
    this.exit();
});
```

<h3 id="casper.getTitle"><code>Casper#getTitle()</code></h3>

Retrieves current page title.

**Example:**

```javascript
casper.start('http://www.google.fr/', function() {
    this.echo(this.getTitle()); // "Google"
});

casper.run();
```

<h3 id="casper.mouseEvent"><code>Casper#mouseEvent(String type, String <a href="selectors.html">selector</a>)</code></h3>

<span class="label label-success">Added in 0.6.9</span>
Triggers a mouse event on the first element found matching the provided
selector.

Supported events are `mouseup`, `mousedown`, `click`, `mousemove`, `mouseover`
and `mouseout`.

**Example:**

```javascript
casper.start('http://www.google.fr/', function() {
    this.mouseEvent('click', 'h2 a');
});

casper.run();
```

<h3 id="casper.open"><code>Casper#open(String location, Object Settings)</code></h3>

Performs an HTTP request for opening a given location. You can forge
`GET`, `POST`, `PUT`, `DELETE` and `HEAD` requests.

**Example for a standard `GET` request:**

```javascript
casper.start();

casper.open('http://www.google.com/').then(function() {
    this.echo('GOT it.');
});

casper.run();
```

**Example for a `POST` request:**

```javascript
casper.start();

casper.open('http://some.testserver.com/post.php', {
    method: 'post',
    data:   {
        'title': 'Plop',
        'body':  'Wow.'
    }
});

casper.then(function() {
    this.echo('POSTED it.');
});

casper.run();
```

<span class="label label-success">Added in 1.0</span>
<span class="label label-info">PhantomJS >= 1.6</span>
You can also set custom request headers to send when performing an outgoing
request, passing the `headers` option:

```javascript
casper.open('http://some.testserver.com/post.php', {
    method: 'post',
    data:   {
        'title': 'Plop',
        'body':  'Wow.'
    },
    headers: {
        'Accept-Language': 'fr,fr-fr;q=0.8,en-us;q=0.5,en;q=0.3'
    }
});
```

<h3 id="casper.reload"><code>Casper#reload([Function then])</code></h3>

<span class="label label-success">Added in 1.0</span>
Reloads current page location.

**Example:**

```javascript
casper.start('http://google.com', function() {
    this.echo("loaded");
    this.reload(function() {
        this.echo("loaded again");
    });
});

casper.run();
```

<h3 id="casper.repeat"><code>Casper#repeat(int times, function then)</code></h3>

Repeats a navigation step a given number of times.

**Example:**

```javascript
casper.start().repeat(3, function() {
    this.echo("Badger");
});

casper.run();
```

<h3 id="casper.resourceExists"><code>Casper#resourceExists(Mixed  test)</code></h3>

Checks if a resource has been loaded. You can pass either a function or
a string to perform the test.

**Example:**

```javascript
casper.start('http://www.google.com/', function() {
    if (this.resourceExists('logo3w.png')) {
        this.echo('Google logo loaded');
    } else {
        this.echo('Google logo not loaded', 'ERROR');
    }
});

casper.run();
```

<span class="label label-info">Note</span> If you want to wait for a resource to
be loaded, use the [`waitForResource()`](#casper.waitForResource) method.

<h3 id="casper.run"><code>Casper#run(fn onComplete[, int  time])</code></h3>

Runs the whole suite of steps and optionally executes a callback when
they've all been done. Obviously, **calling this method is mandatory**
in order to run the Casper navigation suite.

Casper suite **won't run**:

```javascript
casper.start('http://foo.bar/home', function() {
    // ...
});

// hey, it's missing .run() here!
```

Casper suite **will run**:

```javascript
casper.start('http://foo.bar/home', function() {
    // ...
});

casper.run();
```

`Casper.run()` also accepts an `onComplete` callback, which you can
consider as a custom final step to perform when all the other steps have
been executed. Just don't forget to `exit()` Casper if you define one!

```javascript
casper.start('http://foo.bar/home', function() {
    // ...
});

casper.then(function() {
    // ...
});

casper.run(function() {
    this.echo('So the whole suite ended.');
    this.exit(); // <--- don't forget me!
});
```

<h3 id="casper.setHttpAuth"><code>Casper#setHttpAuth(String username, String password)</code></h3>

Sets `HTTP_AUTH_USER` and `HTTP_AUTH_PW` values for HTTP based authentication
systems.

**Example:**

```javascript
casper.start();

casper.setHttpAuth('sheldon.cooper', 'b4z1ng4');

casper.thenOpen('http://password-protected.domain.tld/', function() {
    this.echo("I'm in. Bazinga.");
})
casper.run();
```

Of course you can directly pass the auth string in the url to open:

```javascript
var url = 'http://sheldon.cooper:b4z1ng4@password-protected.domain.tld/';

casper.start(url, function() {
    this.echo("I'm in. Bazinga.");
})

casper.run();
```

<h3 id="casper.start"><code>Casper#start(String url[, function then])</code></h3>

Configures and starts Casper, then open the provided `url` and
optionally adds the step provided by the `then` argument.

**Example:**

```javascript
casper.start('http://google.fr/', function() {
    this.echo("I'm loaded.");
});

casper.run();
```

Alternatively:

```javascript
casper.start('http://google.fr/');

casper.then(function() {
    this.echo("I'm loaded.");
});

casper.run();
```

Or alternatively:

```javascript
casper.start('http://google.fr/');

casper.then(function() {
    casper.echo("I'm loaded.");
});

casper.run();
```

Or even:

```javascript
casper.start('http://google.fr/');

casper.then(function(self) {
    self.echo("I'm loaded.");
});

casper.run();
```

Matter of taste!

<span class="label label-info">Note</span> **You must call the `start()` method
in order to be able to add navigation steps** and run the suite. If you don't
you'll get an error message inviting you to do so anyway.

<h3 id="casper.then"><code>Casper#then(Function fn)</code></h3>

This method is the standard way to add a new navigation step to the stack, by
providing a simple function:

```javascript
casper.start('http://google.fr/');

casper.then(function() {
    this.echo("I'm in your google.");
});

casper.then(function() {
    this.echo('Now, let me write something');
});

casper.then(function() {
    this.echo('Oh well.');
});

casper.run();
```

You can add as many steps as you need. Note that the current `Casper` instance
automatically binds the `this` keyword for you within step functions.

To run all the steps you defined, call the [`run()`](#run) method,
and voila.

<span class="label label-info">Note</span> You must [`start()`](#start)
the casper instance in order to use the `then()` method.

<h3 id="casper.thenEvaluate"><code>Casper#thenEvaluate(Function fn[, Object replacements])</code></h3>

Adds a new navigation step to perform code evaluation within the current
retrieved page DOM.

**Example:**

```javascript
// Querying for "Chuck Norris" on Google
casper.start('http://google.fr/').thenEvaluate(function(term) {
    document.querySelector('input[name="q"]').setAttribute('value', term);
    document.querySelector('form[name="f"]').submit();
}, {
    term: 'Chuck Norris'
});

casper.run();
```

This method is basically a convenient a shortcut for chaining a
[`then()`](#then) and an [`evaluate()`](#evaluate)
calls.

<h3 id="casper.thenOpen"><code>Casper#thenOpen(String location[, mixed options])</code></h3>

Adds a new navigation step for opening a new location, and optionally
add a next step when its loaded.

**Example:**

```javascript
casper.start('http://google.fr/').then(function() {
    this.echo("I'm in your google.");
});

casper.thenOpen('http://yahoo.fr/', function() {
    this.echo("Now I'm in your yahoo.")
});

casper.run();
```

<span class="label label-success">Added in 1.0</span>
You can also specify request settings by passing a [setting object](#casper.open) as the second
argument:

```javascript
casper.start().thenOpen('http://url.to/some/uri', {
    method: "post",
    data: {
      username: 'chuck',
      password: 'n0rr15'
    }
}, function() {
    this.echo("POST request has been sent.")
});

casper.run();
```

<h3 id="casper.thenOpenAndEvaluate"><code>Casper#thenOpenAndEvaluate(String location[, function then, Object replacements])</code></h3>

Basically a shortcut for opening an url and evaluate code against remote
DOM environment.

**Example:**

```javascript
casper.start('http://google.fr/').then(function() {
    this.echo("I'm in your google.");
});

casper.thenOpenAndEvaluate('http://yahoo.fr/', function() {
    var f = document.querySelector('form');
    f.querySelector('input[name=q]').value = 'chuck norris';
    f.submit();
});

casper.run(function() {
    this.debugPage();
    this.exit();
});
```

<h3 id="casper.userAgent"><code>Casper#userAgent(String agent)</code></h3>

<span class="label label-success">Added in 1.0</span>
Sets the [User-Agent string](http://en.wikipedia.org/wiki/User-Agent) to send
through headers when performing requests.

**Example:**

```javascript
casper.start();

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');

casper.thenOpen('http://google.com/', function() {
    this.echo("I'm a Mac.");
});

casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

casper.thenOpen('http://google.com/', function() {
    this.echo("I'm a PC.");
});

casper.run();
```

<h3 id="casper.viewport"><code>Casper#viewport(Number  width, Number height)</code></h3>

Changes current viewport size.

**Example:**

```javascript
casper.viewport(1024, 768);
```

<span class="label label-info">Note</span> PhantomJS comes with a default
viewport size of 400x300, and CasperJS doesn't override it by default.

<h3 id="casper.visible"><code>Casper#visible(String <a href="selectors.html">selector</a>)</code></h3>

Checks if the DOM element matching the provided [selector expression](selectors.html) is visible
in remote page.

**Example:**

```javascript
casper.start('http://google.com/', function() {
    if (this.visible('#hplogo')) {
        this.echo("I can see the logo");
    } else {
        this.echo("I can't see the logo");
    }
});
```

<h3 id="casper.wait"><code>Casper#wait(Number timeout[, Function then])</code></h3>

Pause steps suite execution for a given amount of time, and optionally
execute a step on done.

**Example:**

```javascript
casper.start('http://yoursite.tld/', function() {
    this.wait(1000, function() {
        this.echo("I've waited for a second.");
    });
});

casper.run();
```

You can also write the same thing like this:

```javascript
casper.start('http://yoursite.tld/');

casper.wait(1000, function() {
    this.echo("I've waited for a second.");
});

casper.run();
```

<h3 id="casper.waitFor"><code>Casper#waitFor(Function testFx[, Function then, Function onTimeout, Number timeout])</code></h3>

Waits until a function returns true to process any next step.

You can also set a callback on timeout using the `onTimeout` argument,
and set the timeout using the `timeout` one, in milliseconds. The
default timeout is set to 5000ms.

**Example:**

```javascript
casper.start('http://yoursite.tld/');

casper.waitFor(function check() {
    return this.evaluate(function() {
        return document.querySelectorAll('ul.your-list li').length > 2;
    });
}, function then() {
    this.captureSelector('yoursitelist.png', 'ul.your-list');
});

casper.run();
```

Example using the `onTimeout` callback:

```javascript
casper.start('http://yoursite.tld/');

casper.waitFor(function check() {
    return this.evaluate(function() {
        return document.querySelectorAll('ul.your-list li').length > 2;
    });
}, function then() {    // step to execute when check() is ok
    this.captureSelector('yoursitelist.png', 'ul.your-list');
}, function timeout() { // step to execute if check has failed
    this.echo("I can't haz my screenshot.").exit();
});

casper.run();
```

<h3 id="casper.waitForSelector"><code>Casper#waitForSelector(String <a href="selectors.html">selector</a>[, Function then, Function onTimeout, Number timeout])</code></h3>

Waits until an element matching the provided [selector expression](selectors.html) exists in
remote DOM to process any next step. Uses
[Casper.waitFor()](#casper.waitFor).

**Example:**

```javascript
casper.start('https://twitter.com/#!/n1k0');

casper.waitForSelector('.tweet-row', function() {
    this.captureSelector('twitter.png', 'html');
});

casper.run();
```

<h3 id="casper.waitWhileSelector"><code>Casper#waitWhileSelector(String <a href="selectors.html">selector</a>[, Function then, Function onTimeout, Number timeout])</code></h3>

Waits until an element matching the provided [selector expression](selectors.html) does not
exist in remote DOM to process a next step. Uses
[Casper.waitFor()](#casper.waitFor).

**Example:**

```javascript
casper.start('http://foo.bar/');

casper.waitWhileSelector('.selector', function() {
    this.echo('.selector is no more!');
});

casper.run();
```

<h3 id="casper.waitForResource"><code>Casper#waitForResource(Function testFx[, Function then, Function onTimeout, Number timeout])</code></h3>

Wait until a resource that matches the given `testFx` is loaded to
process a next step. Uses [Casper.waitFor()](#casper.waitFor).

**Example:**

```javascript
casper.start('http://foo.bar/', function() {
    this.waitForResource("foobar.png");
});

casper.then(function() {
    this.echo('foobar.png has been loaded.');
});

casper.run();
```

Another way to write the exact same behavior:

```javascript
casper.start('http://foo.bar/');

casper.waitForResource("foobar.png", function() {
    this.echo('foobar.png has been loaded.');
});

casper.run();
```

<h3 id="casper.waitUntilVisible"><code>Casper#waitUntilVisible(String <a href="selectors.html">selector</a>[, Function then, Function onTimeout, Number timeout])</code></h3>

Waits until an element matching the provided [selector expression](selectors.html) is visible in
the remote DOM to process a next step. Uses
[Casper.waitFor()](#casper.waitFor).

<h3 id="casper.waitWhileVisible"><code>Casper#waitWhileVisible(String <a href="selectors.html">selector</a>[, Function then, Function onTimeout, Number timeout])</code></h3>

Waits until an element matching the provided [selector expression](selectors.html) is no longer
visible in remote DOM to process a next step. Uses
[Casper.waitFor()](#casper.waitFor).

<h3 id="casper.warn"><code>Casper#warn(String message)</code></h3>

Logs and prints a warning message to the standard output.

```javascript
casper.warn("I'm a warning message.");
```

<h3 id="casper.zoom"><code>Casper#zoom(Number factor)</code></h3>

<span class="label label-success">Added in 1.0</span>
<span class="label label-info">PhantomJS >= 1.6</span>
Sets the current page zoom factor.

```javascript
var casper = require('casper').create();

casper.start().zoom(2).thenOpen('http://google.com', function() {
    this.capture('big-google.png');
});

casper.run();
```
