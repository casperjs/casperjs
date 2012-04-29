Sometimes it can be convenient to add your own methods to a `Casper`
object instance; you can easily do so as illustrated in the example
below:

```javascript
var casper = require('casper').create({
    loadImages:  false,
    logLevel:   "debug",
    verbose:    true
});

var links = {
    'http://edition.cnn.com/': 0,
    'http://www.nytimes.com/': 0,
    'http://www.bbc.co.uk/': 0,
    'http://www.guardian.co.uk/': 0
};

var fantomas = Object.create(casper);

fantomas.countLinks = function(selector) {
    return this.evaluate(function() {
        return __utils__.findAll('a[href]').length;
    });
};

fantomas.renderJSON = function(what) {
    return this.echo(JSON.stringify(what, null, '  '));
};

fantomas.start();

Object.keys(links).forEach(function(url) {
    fantomas.thenOpen(url, function() {
        links[url] = this.countLinks();
    });
});

fantomas.run(function() {
    this.renderJSON(links).exit();
});
```

<span class="label label-warning">Warning</span> As of version 0.6, the `Casper.extend()` method has been
deprecated; please now use the method illustrated above.

### Using CoffeeScript

If you're writing your casper scripts using CoffeeScript, this is
getting a bit easier:

```coffeescript
links =
    'http://edition.cnn.com/': 0
    'http://www.nytimes.com/': 0
    'http://www.bbc.co.uk/': 0
    'http://www.guardian.co.uk/': 0

class Fantomas extends require('casper').Casper
    countLinks: ->
        @evaluate ->
            __utils__.findAll('a').length

    renderJSON: (what) ->
        @echo JSON.stringify what, null, '  '

fantomas = new Fantomas
    loadImages:  false
    logLevel:    "debug"
    verbose:     true

fantomas.start()

for url of links
    do (url) ->
        fantomas.thenOpen url, ->
            links[url] = @countLinks()

fantomas.run ->
    @renderJSON links
    @exit()
```
