First, in all honesty, sometimes debugging CasperJS scripts can be **painful**,
and so for several reasons:

- There's [no built-in solid stack traces in Exception objects in
  PhantomJS](http://code.google.com/p/phantomjs/issues/detail?id=166),
  and that's probably why I, more than often, can't show you something more
  helpful than a laconic *TypeError: 'undefined' is not a function*… The only
  stuff we have is a limited emulation of stack traces provided by PhantomJS
  using its `onError` built-in listener, hence those you possibly see when
  using CasperJS…
- There's [no built-in module support in PhantomJS](http://code.google.com/p/phantomjs/issues/detail?id=47).
  The current implementation you're using in CasperJS is somehow a dirty
  hack, which combined to the lack of proper support for stack traces and
  standard error localization obfuscates a lot script debugging…
- Last, Javascript being a wonderful language, it's still very dynamic and
  weakly typed… Well, do I really need to say more?&nbsp;;)

Despite all these issues, you can eventually manage to get around debugging
using some (all?) of the tricks listed above.

## Use the verbose mode

By default & by design, a `Casper` instance won't print anything to the
console. This can be very limitating & frustrating when creating or debugging
scripts, so a good practice is to always start coding a script using these
settings:

```javascript
var casper = require('casper').create({
    verbose: true,
    logLevel: "debug"
});
```

The `verbose` setting will tell Casper to write every logged message at the
`logLevel` logging level onto the standard output, so you'll be able to trace
every step made.

<span class="label label-warning">Warning</span> Output will then be pretty
verbose, and will potentially display sensitive informations onto the console.
**Use with care on production.**

## Hook in the deep using events

[Events](events-filters.html) are a very powerful features of CasperJS, and you
should probably give it a look if you haven't already.

Some interesting events you may eventually use to debug your scripts:

- The `http.status.XXX` event will be emitted everytime a resource is sent with
  the [HTTP code](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
  corresponding to `XXX`;
- The `remote.alert` everytime an `alert()` call is performed client-side;
- `remote.message` everytime a message is sent to the client-side console;
- `step.added` everytime a step is added to the stack;
- etc…

Listening to an event is dead easy:

```javascript
casper.on('http.status.404', function(resource) {
    this.log('Hey, this one is 404: ' + resource.url, 'warning');
});
```

Ensure to check the [full list](events.html#events) of all the other available
events.

## Localize yourself in modules

If you're creating Casper modules, a cool thing to know is that there's a
special built-in variable available in every module, `__file__`, which contains
the absolute path to current javascript file (the module file).

## Always, **ALWAYS** name your closures

Probably one of the most easy but effective best practice, always name your
closures:

**Hard to track:**

```javascript
casper.start('http://foo.bar/', function() {
    this.evaluate(function() {
        // ...
    });
});
```

**Easier:**

```javascript
casper.start('http://foo.bar/', function afterStart() {
    this.evaluate(function evaluateStuffAfterStart() {
        // ...
    });
});
```

That way, everytime one is failing, its name will be printed out in the *stack
trace*, **so you can more easily locate it within your code**.

Note that this one also applies for all your other Javascript works, of course
;)
