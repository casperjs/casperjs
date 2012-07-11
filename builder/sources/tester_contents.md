Casper ships with a `tester` module and a `Tester` class providing an
API for unit & functional testing purpose. By default you can access an
instance of this class through the `test` property of any `Casper` class
instance.

<span class="label label-info">Note</span> The best way to learn how to use the
Tester API and see it in action is probably to have a look at the [CasperJS
test suite code](https://github.com/n1k0/casperjs/blob/master/tests/run.js).

<h3 id="tester.assert"><code>Tester#assert(Boolean condition[, String message])</code></h3>

Asserts that the provided condition strictly resolves to a boolean
`true`.

```javascript
var url = 'http://www.google.fr/';
var casper = require('casper').create();
casper.start(url, function() {
    this.test.assert(this.getCurrentUrl() === url, 'url is the one expected');
});
```

<h3 id="tester.assertDoesntExist"><code>Tester#assertDoesntExist(String selector[, String message])</code></h3>

Asserts that an element matching the provided
[selector expression](selectors.html) doesn't exists within the remote DOM
environment.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertDoesntExist('form[name="gs"]', 'google.fr has a form with name "gs"');
});
```

<h3 id="tester.assertEquals"><code>Tester#assertEquals(mixed testValue, mixed expected[, String message])</code></h3>

Asserts that two values are strictly equals.

```javascript
var url = 'http://www.google.fr/';
var casper = require('casper').create();
casper.start(url, function() {
    this.test.assertEquals(this.getCurrentUrl(), url, 'url is the one expected');
});
```

<h3 id="tester.assertEval"><code>Tester#assertEval(Function fn[, String message])</code></h3>

Asserts that a [code evaluation in remote DOM](api.html#casper.evaluate)
resolves to a boolean `true`.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertEval(function() {
        return document.querySelectorAll('form').length > 0;
    }, 'google.fr has at least one form');
});
```

<h3 id="tester.assertEvalEquals"><code>Tester#assertEvalEquals(Function fn, mixed expected[, String message])</code></h3>

Asserts that the result of a
[code evaluation in remote DOM](api.html#casper.evaluate) equals to the
expected value.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertEvalEquals(function() {
        return document.querySelectorAll('form').length;
    }, 1, 'google.fr provides a single form tag');
});
```

<h3 id="tester.assertExists"><code>Tester#assertExists(String selector[, String message])</code></h3>

Asserts that an element matching the provided [selector expression](selectors.html) exists in
remote DOM environment.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertExists('form[name="gs"]', 'google.fr has a form with name "gs"');
});
```

<h3 id="tester.assertHttpStatus"><code>Tester#assertHttpStatus(Number status[, String message])</code></h3>

Asserts that current [HTTP status code](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)
is the same as the one passed as argument.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertHttpStatus(200, 'google.fr is up');
});
```

<h3 id="tester.assertMatch"><code>Tester#assertMatch(mixed subject, RegExp pattern[, String message])</code></h3>

Asserts that a provided string matches a provided javascript `RegExp`
pattern.

```javascript
casper.test.assertMatch('Chuck Norris', /^chuck/i, 'Chuck Norris' first name is Chuck');
```

<h3 id="tester.assertNot"><code>Tester#assertNot(mixed subject[, String message])</code></h3>

Asserts that the passed subject resolves to some
[falsy value](http://11heavens.com/falsy-and-truthy-in-javascript).

```javascript
casper.test.assertNot(false, "Universe is still operational");
```

<h3 id="tester.assertNotEquals"><code>Tester#assertNotEquals(mixed testValue, mixed expected[, String message])</code></h3>

<span class="label label-success">Added in 0.6.7</span>
Asserts that two values are **not** strictly equals.

```javascript
casper.test.assertNotEquals(true, "Truth is out");
```

<h3 id="tester.assertRaises"><code>Tester#assertRaises(Function fn, Array args[, String message])</code></h3>

Asserts that the provided function called with the given parameters
raises a javascript `Error`.

```javascript
casper.test.assertRaises(function(throwIt) {
    if (throwIt) {
        throw new Error('thrown');
    }
}, [true], 'Error has been raised.');

casper.test.assertRaises(function(throwIt) {
    if (throwIt) {
        throw new Error('thrown');
    }
}, [false], 'Error has been raised.'); // fails
```

<h3 id="tester.assertSelectorExists"><code>Tester#assertSelectorExists(String selector[, String message])</code></h3>

Asserts that at least an element matching the provided [selector expression](selectors.html)
exists in remote DOM.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertSelectorExists('form[name="gs"]', 'google.fr provides a form');
});
```

<h3 id="tester.assertResourceExists"><code>Tester#assertResourceExists(Function testFx[, String message])</code></h3>

The `testFx` function is executed against all loaded assets and the test passes
when at least one resource matches.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertResourceExists(function (resource) {
      return resource.url.match('logo3w.png');
    }, 'google.fr logo was loaded');
    // or shorter
    this.test.assertResourceExists('logo3w.png', 'google.fr logo was loaded');
});
```

Check the documentation for [`Casper.resourceExists()`](api.html#casper.resourceExists).

<h3 id="tester.assertTextExists"><code>Tester#assertTextExists(String expected[, String message])</code></h3>

Asserts that body **plain text content** contains the given string.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertTextExists('google', 'page body contains "google"');
});
```

<h3 id="tester.assertTitle"><code>Tester#assertTitle(String expected[, String message])</code></h3>

Asserts that title of the remote page equals to the expected one.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertTitle('Google', 'google.fr has the correct title');
});
```

<h3 id="tester.assertTitleMatch"><code>Tester#assertTitleMatch(RegExp pattern[, String message])</code></h3>

Asserts that title of the remote page matches the provided RegExp pattern.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertTitleMatch(/Google/, 'google.fr has a quite predictable title');
});
```

<h3 id="tester.assertType"><code>Tester#assertType(mixed input, String type[, String message])</code></h3>

Asserts that the provided input is of the given type.

```javascript
var casper = require('casper').create();
casper.test.assertType(42, "number", "Okay, 42 is a number");
casper.test.assertType([1, 2, 3], "array", "Yeah, we can test for arrays too =)");
```

<h3 id="tester.assertUrlMatch"><code>Tester#assertUrlMatch(Regexp pattern[, String message])</code></h3>

Asserts that a the current page url matches the provided RegExp pattern.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertUrlMatch(/^http:\/\//', 'google.fr is served in http://');
});
```

<h3 id="tester.colorize"><code>Tester#colorize(String message, String style)</code></h3>

Render a colorized output. Basically a proxy method for
`Casper.Colorizer#colorize()`.

<h3 id="tester.comment"><code>Tester#comment(String message)</code></h3>

Writes a comment-style formatted message to stdout.

```javascript
var casper = require('casper').create();
casper.test.comment("Hi, I'm a comment");
```

<h3 id="tester.error"><code>Tester#error(String message)</code></h3>

Writes an error-style formatted message to stdout.

```javascript
var casper = require('casper').create();
casper.test.error("Hi, I'm an error");
```

<h3 id="tester.fail"><code>Tester#fail(String message)</code></h3>

Adds a failed test entry to the stack.

```javascript
var casper = require('casper').create();
casper.test.fail("Georges W. Bush");
```

<h3 id="tester.formatMessage"><code>Tester#formatMessage(String message, String style)</code></h3>

Formats a message to highlight some parts of it. Only used internally by
the tester.

<h3 id="tester.getFailures"><code>Tester#getFailures()</code></h3>

<span class="label label-success">Added in 1.0</span>
Retrieves failures for current test suite.

```javascript
casper.test.assertEquals(true, false);
require('utils').dump(casper.test.getFailures());
casper.test.done();
```

That will give something like this:

```
$ casperjs test test-getFailures.js
Test file: test-getFailures.js
FAIL Subject equals the expected value
#    type: assertEquals
#    subject: true
#    expected: false
{
    "length": 1,
    "cases": [
        {
            "success": false,
            "type": "assertEquals",
            "standard": "Subject equals the expected value",
            "file": "test-getFailures.js",
            "values": {
                "subject": true,
                "expected": false
            }
        }
    ]
}
FAIL 1 tests executed, 0 passed, 1 failed.

Details for the 1 failed test:

In c.js:0
   assertEquals: Subject equals the expected value
```

<h3 id="tester.getPasses"><code>Tester#getPasses()</code></h3>

<span class="label label-success">Added in 1.0</span>
Retrieves a report for successful test cases in the current test suite.

```javascript
casper.test.assertEquals(true, true);
require('utils').dump(casper.test.getPasses());
casper.test.done();
```

That will give something like this:

```
$ casperjs test test-getPasses.js
Test file: test-getPasses.js
PASS Subject equals the expected value
{
    "length": 1,
    "cases": [
        {
            "success": true,
            "type": "assertEquals",
            "standard": "Subject equals the expected value",
            "file": "test-getPasses.js",
            "values": {
                "subject": true,
                "expected": true
            }
        }
    ]
}
PASS 1 tests executed, 1 passed, 0 failed.
```

<h3 id="tester.info"><code>Tester#info(String message)</code></h3>

Writes an info-style formatted message to stdout.

```javascript
var casper = require('casper').create();
casper.test.info("Hi, I'm an informative message.");
```

<h3 id="tester.pass"><code>Tester#pass(String message)</code></h3>

Adds a successful test entry to the stack.

```javascript
var casper = require('casper').create();
casper.test.pass("Barrack Obama");
```

<h3 id="tester.renderResults"><code>Tester#renderResults(Boolean exit, Number status, String save)</code></h3>

Render tests results, save results in an XUnit formatted file, and optionally
exit phantomjs.

```javascript
var casper = require('casper').create();
// ...
casper.run(function() {
    // exists with status code 0 and saves XUnit formatted results
    // in test-results.xml
    this.test.renderResults(true, 0, 'test-results.xml');
});
```
