CasperJS provides an [event handler](#events) very similar to the
[one](https://github.com/joyent/node/blob/master/lib/events.js) shipping
with [nodejs](http://nodejs.org); actually it borrows most of its
codebase. CasperJS also adds [*filters*](#filters), which are basically
ways to alter values asynchronously.

* * * * *

<h2 id="events">Events</h2>

Using events is pretty much straightforward if you're a node developer,
or if you worked with any evented system before:

```javascript
var casper = require('casper').create();

casper.on('resource.received', function(resource) {
    casper.echo(resource.url);
});
```

Here's a table containing all the available events with all the
parameters passed to their callback:

<table class="table table-striped table-condensed" caption="Casper events">
  <thead>
    <tr>
      <th>Name</th>
      <th>Arguments</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>back</code></td>
      <td><code>None</code></td>
      <td>Emitted when the embedded browser is asked to go back a step in its history.</td>
    </tr>
    <tr>
      <td><code>capture.saved</code></td>
      <td><code>targetFile</code></td>
      <td>Emitted when a screenshot image has been captured.</td>
    </tr>
    <tr>
      <td><code>click</code></td>
      <td><code>selector</code></td>
      <td>Emitted when the <code>Casper.click()</code> method has been called.</td>
    </tr>
    <tr>
      <td><code>die</code></td>
      <td><code>message, status</code></td>
      <td>Emitted when the <code>Casper.die()</code> method has been called.</td>
    </tr>
    <tr>
      <td><code>downloaded.file</code></td>
      <td><code>targetPath</code></td>
      <td>Emitted when </td>
    </tr>
    <tr>
      <td><code>error</code></td>
      <td><code>msg, backtrace</code></td>
      <td>
        <span class="label label-success">Added in 0.6.9</span>
        Emitted when an error hasn't been caught. Do basically what PhantomJS'
        <code>onError()</code> native handler does.
      </td>
    </tr>
    <tr>
      <td><code>exit</code></td>
      <td><code>status</code></td>
      <td>Emitted when the <code>Casper.exit()</code> method has been called.</td>
    </tr>
    <tr>
      <td><code>fill</code></td>
      <td><code>selector, vals, submit</code></td>
      <td>Emitted when a form is filled using the <code>Casper.fill()</code> method.</td>
    </tr>
    <tr>
      <td><code>forward</code></td>
      <td><code>None</code></td>
      <td>Emitted when the embedded browser is asked to go forward a step in its history.</td>
    </tr>
    <tr>
      <td><code>http.auth</code></td>
      <td><code>username, password</code></td>
      <td>Emitted when http authentication parameters are set.</td>
    </tr>
    <tr>
      <td><code>http.status.[code]</code></td>
      <td><code>resource</code></td>
      <td>
        <p>
          Emitted when any given HTTP reponse is received with the status code
          specified by <code>[code]</code>, eg.:
        </p>
        <pre class="prettyprint">casper.on('http.status.404', function(resource) {
    casper.echo(resource.url + ' is 404');
})</pre>
        </td>
    </td>
    <tr>
      <td><code>load.started</code></td>
      <td><code>None</code></td>
      <td>Emitted when PhantomJS' <code>WebPage.onLoadStarted</code> event callback is called.</td>
    </tr>
    <tr>
      <td><code>load.failed</code></td>
      <td><code>Object</code></td>
      <td>
        Emitted when PhantomJS' <code>WebPage.onLoadFinished</code> event callback has been called and
        failed.
      </td>
    </tr>
    <tr>
      <td><code>load.finished</code></td>
      <td><code>status</code></td>
      <td>Emitted when PhantomJS' <code>WebPage.onLoadFinished</code> event callback is called.</td>
    </tr>
    <tr>
      <td><code>log</code></td>
      <td><code>entry</code></td>
      <td>
        <p>Emitted when the <code>Casper.log()</code> method has been called. The
        <code>entry</code> parameter is an Object like this:</p>
        <pre class="prettyprint">{
    level:   "debug",
    space:   "phantom",
    message: "A message",
    date:    "a javascript Date instance"
}</pre>
      </td>
    </tr>
    <tr>
      <td><code>mouse.click</code></td>
      <td><code>args</code></td>
      <td>Emitted when the mouse left-click something or somewhere.</td>
    </tr>
    <tr>
      <td><code>mouse.down</code></td>
      <td><code>args</code></td>
      <td>Emitted when the mouse presses on something or somewhere with the left button.</td>
    </tr>
    <tr>
      <td><code>mouse.move</code></td>
      <td><code>args</code></td>
      <td>Emitted when the mouse moves onto something or somewhere.</td>
    </tr>
    <tr>
      <td><code>mouse.up</code></td>
      <td><code>args</code></td>
      <td>Emitted when the mouse releases the left button over something or somewhere.</td>
    </tr>
    <tr>
      <td><code>open</code></td>
      <td><code>location, settings</code></td>
      <td>
        <p>Emitted when an HTTP request is sent. First callback arg is
        the location, second one is a request settings Object of the form:</p>
        <pre class="prettyprint">{
    method: "post",
    data:   "foo=42&amp;chuck=norris"
}</pre>
      </td>
    </tr>
    <tr>
      <td><code>page.created</code></td>
      <td><code>page</code></td>
      <td>Emitted when PhantomJS' <code>WebPage</code> object used by CasperJS has been created.</td>
    </tr>
    <tr>
      <td><code>page.error</code></td>
      <td><code>message, trace</code></td>
      <td>
        Emitted when retrieved page leaved a Javascript error uncaught:
        <pre class="prettyprint">casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg, "ERROR");
});</pre>
      </td>
    </tr>
    <tr>
      <td><code>page.initialized</code></td>
      <td><code>page</code></td>
      <td>Emitted when PhantomJS' <code>WebPage</code> object used by CasperJS has been initialized.</td>
    </tr>
    <tr>
      <td><code>remote.alert</code></td>
      <td><code>message</code></td>
      <td>Emitted when a remote <code>alert()</code> call has been performed.</td>
    </tr>
    <tr>
      <td><code>remote.message</code></td>
      <td><code>msg</code></td>
      <td>Emitted when any remote console logging call has been performed.</td>
    </tr>
    <tr>
      <td><code>resource.received</code></td>
      <td><code>resource</code></td>
      <td>Emitted when any resource has been received.</td>
    </tr>
    <tr>
      <td><code>resource.requested</code></td>
      <td><code>request</code></td>
      <td>Emitted when any resource has been requested.</td>
    </tr>
    <tr>
      <td><code>run.complete</code></td>
      <td><code>None</code></td>
      <td>Emitted when the whole series of steps in the stack have been executed.</td>
    </tr>
    <tr>
      <td><code>run.start</code></td>
      <td><code>None</code></td>
      <td>Emitted when <code>Casper.run()</code> is called.</td>
    </tr>
    <tr>
      <td><code>starting</code></td>
      <td><code>None</code></td>
      <td>Emitted when <code>Casper.start()</code> is called.</td>
    </tr>
    <tr>
      <td><code>started</code></td>
      <td><code>None</code></td>
      <td>Emitted when Casper has been started using <code>Casper.start()</code>.</td>
    </tr>
    <tr>
      <td><code>step.added</code></td>
      <td><code>step</code></td>
      <td>Emitted when a new navigation step has been added to the stack.</td>
    </tr>
    <tr>
      <td><code>step.complete</code></td>
      <td><code>stepResult</code></td>
      <td>Emitted when a navigation step has been executed.</td>
    </tr>
    <tr>
      <td><code>step.created</code></td>
      <td><code>fn</code></td>
      <td>Emitted when a new navigation step has been created.</td>
    </tr>
    <tr>
      <td><code>step.start</code></td>
      <td><code>step</code></td>
      <td>Emitted when a navigation step has been started.</td>
    </tr>
    <tr>
      <td><code>step.timeout</code></td>
      <td><code>None</code></td>
      <td>Emitted when a navigation step has been executed.</td>
    </tr>
    <tr>
      <td><code>timeout</code></td>
      <td><code>None</code></td>
      <td>
        Emitted when the execution time of the script has reached
        the <code>Casper.options.timeout</code> value.
      </td>
    </tr>
    <tr>
      <td><code>viewport.changed</code></td>
      <td><code>[width, height]</code></td>
      <td>Emitted when the viewport has been changed.</td>
    </tr>
    <tr>
      <td><code>wait.done</code></td>
      <td><code>None</code></td>
      <td>Emitted when a <code>Casper.wait*()</code> operation ends.</td>
    </tr>
    <tr>
      <td><code>wait.start</code></td>
      <td><code>None</code></td>
      <td>Emitted when a <code>Casper.wait*()</code> operation starts.</td>
    </tr>
    <tr>
      <td><code>waitFor.timeout</code></td>
      <td><code>None</code></td>
      <td>
        Emitted when the execution time of a <code>Casper.wait*()</code>
        operation has exceeded the value of <code>Casper.options.stepTimeout</code>.
      </td>
    </tr>
  </tbody>
</table>

### Emitting you own events

Of course you can emit your own events, using the `Casper.emit()`
method:

```javascript
var casper = require('casper').create();

// listening to a custom event
casper.on('google.loaded', function() {
    this.echo('Google page title is ' + this.getTitle());
});

casper.start('http://google.com/', function() {
    // emitting a custom event
    this.emit('google.loaded');
});

casper.run();
```

* * * * *

<h2 id="filters">Filters</h2>

Filters allow you to alter some values asynchronously. Sounds obscure? Let's
take a simple example and imagine you would like to alter every
single url opened by CasperJS to append a `foo=42` query string
parameter:

```javascript
var casper = require('casper').create();

casper.setFilter('open.location', function(location) {
    return /\?+/.test(location) ? location += "&foo=42" : location += "?foo=42";
});
```

There you have it, every single requested url will have this appended.
Let me bet you'll find far more interesting use cases than my silly one
;)

Here'a the list of all available filters with their expected return
value:

<table class="table table-striped table-condensed" caption="Casper options">
  <thead>
    <tr>
      <th>Name</th>
      <th>Arguments</th>
      <th>Return type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>capture.target_filename</code></td>
      <td><code>args</code></td>
      <td><code>String</code></td>
      <td>Allows to alter the value of the filename where a screen capture should be stored.</td>
    </tr>
    <tr>
      <td><code>echo.message</code></td>
      <td><code>message</code></td>
      <td><code>String</code></td>
      <td>Allows to alter every message written onto stdout.</td>
    </tr>
    <tr>
      <td><code>log.message</code></td>
      <td><code>message</code></td>
      <td><code>String</code></td>
      <td>Allows to alter every log message.</td>
    </tr>
    <tr>
      <td><code>open.location</code></td>
      <td><code>args</code></td>
      <td><code>String</code></td>
      <td>Allows to alter every url before it being opened.</td>
    </tr>
  </tbody>
</table>
