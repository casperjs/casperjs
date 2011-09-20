# Casper.js

Casper.js is a navigation utility for [PhantomJS](http://www.phantomjs.org/). It eases the process of defining a full navigation scenario and provides useful high-level function, methods & syntaxic sugar for doing common tasks such as:

- chaining navigation steps
- capturing screenshots of a page (or an area)
- logging events
- evaluating dynamic code within the remote page environment
- retrieve base64 encoded version of remote resources
- catch errors and react accordingly

## Quickstart

In the following example, we'll query google for two terms consecutively, `capser` and `homer`, and aggregate the result links in a standard Array. Running the script will output a standard JSON string containing both the logs and the results:

``` javascript
phantom.injectJs('path/to/casper.js');

// User defined functions
function q() {
    document.querySelector('input[name="q"]').setAttribute('value', '%term%');
    document.querySelector('form[name="f"]').submit();
}

function getLinks() {
    var links = document.querySelectorAll('h3.r a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

// Casper suite
var links = [];
var casper = new phantom.Casper({
    logLevel: "info"
});
casper.start('http://google.fr/')
    .thenEvaluate(q, {
        term: 'casper'
    })
    .then(function(self) {
        links = self.evaluate(getLinks);
    })
    .thenEvaluate(q, {
        term: 'homer'
    })
    .then(function(self) {
        links = links.concat(self.evaluate(getLinks));
    })
    .run(function(self) {
        self.echo(JSON.stringify({
            result: self.result,
            links: links
        }, null, '  '));
        self.exit();
    })
;
```
**Hint:** Method chaining is not mandatory but provided as an alternative way to structure your code.

Run it:

    $ phantomjs example.js
    {
      "result": {
        "log": [
          {
            "level": "info",
            "space": "phantom",
            "message": "Starting…",
            "date": "Mon Sep 05 2011 16:10:56 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Running suite: 4 steps",
            "date": "Mon Sep 05 2011 16:10:56 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 1/4: http://www.google.fr/ (HTTP 301)",
            "date": "Mon Sep 05 2011 16:10:57 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 1/4: done in 1259ms.",
            "date": "Mon Sep 05 2011 16:10:57 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 2/4: http://www.google.fr/search?sclient=psy&hl=fr&site=&source=hp&q=casper&pbx=1&oq=&aq=&aqi=&aql=&gs_sm=&gs_upl= (HTTP 301)",
            "date": "Mon Sep 05 2011 16:10:58 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 2/4: done in 2145ms.",
            "date": "Mon Sep 05 2011 16:10:58 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 3/4: http://www.google.fr/search?sclient=psy&hl=fr&site=&source=hp&q=casper&pbx=1&oq=&aq=&aqi=&aql=&gs_sm=&gs_upl= (HTTP 301)",
            "date": "Mon Sep 05 2011 16:10:58 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 3/4: done in 2390ms.",
            "date": "Mon Sep 05 2011 16:10:58 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 4/4: http://www.google.fr/search?sclient=psy&hl=fr&source=hp&q=homer&pbx=1&oq=&aq=&aqi=&aql=&gs_sm=&gs_upl= (HTTP 301)",
            "date": "Mon Sep 05 2011 16:10:59 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 4/4: done in 3077ms.",
            "date": "Mon Sep 05 2011 16:10:59 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Done 4 steps in 3077ms.",
            "date": "Mon Sep 05 2011 16:10:59 GMT+0200 (CEST)"
          }
        ],
        "status": "success",
        "time": 3077
      },
      "links": [
        "http://fr.wikipedia.org/wiki/Casper_le_gentil_fant%C3%B4me",
        "http://fr.wikipedia.org/wiki/Casper",
        "http://casperflights.com/",
        "http://www.allocine.fr/film/fichefilm_gen_cfilm=13018.html",
        "/search?q=casper&hl=fr&prmd=ivns&tbm=isch&tbo=u&source=univ&sa=X&ei=cdhkTurpFa364QTB5uGeCg&ved=0CFkQsAQ",
        "http://www.youtube.com/watch?v=Kuvo0QMiNEE",
        "http://www.youtube.com/watch?v=W7cW5YlHaeQ",
        "http://www.imdb.com/title/tt0112642/",
        "http://blog.caspie.net/",
        "http://www.casperwy.gov/",
        "http://www.lequipe.fr/Cyclisme/CyclismeFicheCoureur147.html",
        "http://homer-simpson-tv.blog4ever.com/",
        "http://fr.wikipedia.org/wiki/Homer_Simpson",
        "http://en.wikipedia.org/wiki/Homer",
        "/search?q=homer&hl=fr&prmd=ivnsb&tbm=isch&tbo=u&source=univ&sa=X&ei=cthkTr73Hefh4QSUmt3UCg&ved=0CEQQsAQ",
        "http://www.youtube.com/watch?v=Ajd08hgerRo",
        "http://www.koreus.com/video/homer-simpson-photo-39-ans.html",
        "http://www.nrel.gov/homer/",
        "http://www.luds.net/homer.php",
        "http://www.thesimpsons.com/bios/bios_family_homer.htm",
        "http://www.homeralaska.org/",
        "http://homeralaska.com/"
      ]
    }

### CoffeeScript

You can also write Casper scripts using the [CoffeeScript syntax](http://jashkenas.github.com/coffee-script/):

``` coffeescript
phantom.injectJs "path/to/casper.js"

q = ->
    document.querySelector('input[name="q"]').setAttribute "value", "%term%"
    document.querySelector('form[name="f"]').submit()

getLinks = ->
    links = document.querySelectorAll("h3.r a")
    Array::map.call links, (e) ->
        e.getAttribute "href"

links = []

casper = new phantom.Casper verbose: true, logLevel: "debug"
casper.start "http://google.fr/"
casper.thenEvaluate q, term: "casper"
casper.then -> links = casper.evaluate getLinks
casper.thenEvaluate q, term: "homer"
casper.then -> links = links.concat casper.evaluate getLinks
casper.run ->
    out =
        result: casper.result
        links:  links
    casper.echo JSON.stringify out, null, "    "
    casper.exit()
```

## Casper.js API Documentation

Code is quite heavily documented using `jsdoc`, but here are the whole API documentation with sample examples supplied:

### Casper#base64encode(String url)

Encodes a resource using the base64 algorithm synchroneously using client-side XMLHttpRequest.

NOTE: we cannot use `window.btoa()` because it fails miserably in the version of WebKit shipping with PhantomJS.

Example: retrieving google logo image encoded in base64:

``` javascript
var base64logo = null;
casper.start('http://www.google.fr/', function(self) {
    base64logo = self.base64encode('http://www.google.fr/images/srpr/logo3w.png');
}).run(function() {
    self.echo(base64logo);
});
```

### Casper#capture(String targetFilepath, Object clipRect)

Proxy method for PhantomJS' `WebPage#render`. Adds a clipRect parameter for automatically setting page clipRect setting values and sets it back once done.

Example:

``` javascript
casper.start('http://www.google.fr/', function(self) {
    self.capture('google.png', {
        top: 100,
        left: 100,
        width: 500,
        height: 400
    });
}).run();
```

### Casper#debugHTML()

Logs the HTML code of the current page directly to the standard output, for debugging purpose.

Example:

``` javascript
casper.start('http://www.google.fr/', function(self) {
    self.debugHTML();
}).run();
```

### Casper#debugPage()

Logs the textual contents of the current page directly to the standard output, for debugging purpose.

Example:

``` javascript
casper.start('http://www.google.fr/', function(self) {
    self.debugPage();
}).run();
```

### Casper#die(String message[, int status])

Exits phantom with a logged error message and an optional exit status code.

Example:

``` javascript
casper.start('http://www.google.fr/', function(self) {
    self.die("Fail.", 1);
}).run();
```

### Casper#echo(String message)

Prints something to stdout.

Example:

``` javascript
casper.start('http://www.google.fr/', function(self) {
    self.echo('Page title is: ' + self.evaluate(function() {
        return document.title;
    }));
}).run();
```

### Casper#evaluate(function fn[, Object replacements])

Evaluates an expression in the page context, a bit like what PhantomJS' `WebPage#evaluate` does, but can also replace values by their placeholer names.

Example:

``` javascript
casper.evaluate(function() {
    document.querySelector('#username').setAttribute('value', '%username%');
    document.querySelector('#password').setAttribute('value', '%password%');
    document.querySelector('#submit').click();
}, {
    username: 'Bazoonga',
    password: 'baz00nga'
});
```

### Casper#evaluateOrDie(function fn[, String message])

Evaluates an expression within the current page DOM and `die()` if it returns anything but `true`.

Example:

``` javascript
casper.start('http://foo.bar/home', function(self) {
    self.evaluateOrDie(function() {
        return /logged in/.match(document.title);
    }, 'not authenticated');
}).run();
```

### Casper#exit([int status])

Exits PhantomJS with an optional exit status code.

### Casper#log(String message[, String level, String space)

Logs a message with an optional level in an optional space. Available levels are `debug`, `info`, `warning` and `error`. A space is a kind of namespace you can set for filtering your logs. By default, Casper logs messages in two distinct spaces: `phantom` and `remote`, to distinguish what happens in the PhantomJS environment from the remote one.

Example:

``` javascript
casper.start('http://www.google.fr/', function(self) {
    self.log("I'm logging an error", "error");
}).run();
```

### Casper#repeat(int times, function then)

Repeats a navigation step a given number of times.

Example:

``` javascript
var i = 0;
casper.start('http://foo.bar/home', function(self) {
    self.evaluateOrDie(function() {
        return /logged in/.match(document.title);
    }, 'not authenticated');
}).repeat(5, function(self) {
    self.echo("I am step #" + ++i);
}).run();
```

### Casper#run(fn onComplete[, int time])

Runs the whole suite of steps and optionally executes a callback when they've all been done. Obviously, **calling this method is mandatory** in order to run the Casper navigation suite.

Casper suite **won't run**:

``` javascript
casper.start('http://foo.bar/home', function(self) {
    // ...
}).then(function(self) {
    // ...
});
```

Casper suite **will run**:

``` javascript
casper.start('http://foo.bar/home', function(self) {
    // ...
}).then(function(self) {
    // ...
}).run();
```

### Casper#start(String url[, function then])

Configures and starts Casper, then open the provided `url` and optionnaly adds the step provided by the `then` argument.

Example:

``` javascript
casper.start('http://google.fr/', function(self) {
    self.echo("I'm loaded.");
}).run();
```

Alternatively:

``` javascript
casper.start('http://google.fr/');
casper.then(function(self) {
    self.echo("I'm loaded.");
});
casper.run();
```

Please note that **you must call the `start()` method in order to be able to add navigation steps** and run the suite. If you don't you'll get an error message inviting you to do so anyway.

### Casper#then(function fn)

The standard way to add a new navigation step to the Casper suite by provide a callback function which will be executed when the requested page is loaded.

Example:

``` javascript
casper.start('http://google.fr/').then(function(self) {
    self.echo("I'm in your google.");
}).run();
```

Please note that usage of the `self` argument is not mandatory, it's just pythonic-like syntaxic sugar. You can perfectly use this alternative:

``` javascript
casper.start('http://google.fr/').then(function() {
    casper.echo("I'm in your google.");
}).run();
```

If you want to open a page as a next step in your navigation scenario, please refer to the `Casper#thenOpen()` method documentation.

### Casper#thenEvaluate(function fn[, Object replacements])

Adds a new navigation step to perform code evaluation within the current retrieved page DOM.

Example:

``` javascript
// Querying for "Chuck Norris" on Google
casper.start('http://google.fr/').thenEvaluate(function() {
    document.querySelector('input[name="q"]').setAttribute('value', '%term%');
    document.querySelector('form[name="f"]').submit();
}, {
    term: 'Chuck Norris'
}).run();
```

### Casper#thenOpen(String location[, function then])

Adds a new navigation step for opening a new location, and optionnaly add a next step when its loaded.

Example:

``` javascript
casper.start('http://google.fr/').then(function(self) {
    self.echo("I'm in your google.");
}).thenOpen('http://yahoo.fr/', function(self) {
    self.echo("Now I'm in your yahoo.")
}).run();
```

## Licensing

`Casper.js` is released under the terms of the [MIT license](http://en.wikipedia.org/wiki/MIT_License).

## Now what

Feel free to play with the code and [report an issue on github](https://github.com/n1k0/casperjs/issues). I'm also reachable [on twitter](https://twitter.com/n1k0).
