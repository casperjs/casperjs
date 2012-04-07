Casper ships with a `tester` module and a `Tester` class providing an
API for unit & functional testing purpose. By default you can access an
instance of this class through `test` property of any `Casper` class
instance.

<span class="label label-info">Note</span> The best way to learn how to use the
Tester API and see it in action is probably to have a look at the [CasperJS
test suite code](https://github.com/n1k0/casperjs/blob/master/tests/run.js).

<h3 id="phantom_Casper_Tester_assert"><code>Tester#assert(Boolean condition[, String message])</code></h3>

Asserts that the provided condition strictly resolves to a boolean
`true`.

```javascript
var url = 'http://www.google.fr/';
var casper = require('casper').create();
casper.start(url, function() {
    this.test.assert(this.getCurrentUrl() === url, 'url is the one expected');
});
```

<h3 id="phantom_Casper_Tester_assertEquals"><code>Tester#assertEquals(mixed testValue, mixed expected[, String message])</code></h3>

Asserts that two values are strictly equals.

```javascript
var url = 'http://www.google.fr/';
var casper = require('casper').create();
casper.start(url, function() {
    this.test.assertEquals(this.getCurrentUrl(), url, 'url is the one expected');
});
```

<h3 id="phantom_Casper_Tester_assertEval"><code>Tester#assertEval(Function fn[, String message])</code></h3>

Asserts that a code evaluation in remote DOM resolves to true.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertEval(function() {
        return document.querySelectorAll('form').length > 0;
    }, 'google.fr has at least one form');
});
```

<h3 id="phantom_Casper_Tester_assertEvalEquals"><code>Tester#assertEvalEquals(Function fn, mixed expected[, String message])</code></h3>

Asserts that the result of a code evaluation in remote DOM equals.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertEvalEquals(function() {
        return document.querySelectorAll('form').length;
    }, 1, 'google.fr provides a single form tag');
});
```

<h3 id="phantom_Casper_Tester_assertExists"><code>Tester#assertExists(String selector[, String message])</code></h3>

Asserts that an element matching the provided CSS3 selector exists in
remote DOM environment.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertExists('form[name="gs"]', 'google.fr has a form with name "gs"');
});
```

<h3 id="phantom_Casper_Tester_assertMatch"><code>Tester#assertMatch(mixed subject, RegExp pattern[, String message])</code></h3>

Asserts that a provided string matches a provided javascript `RegExp`
pattern.

```javascript
casper.test.assertMatch('Chuck Norris', /^chuck/i, 'Chuck Norris' first name is chuck');
```

<h3 id="phantom_Casper_Tester_assertNot"><code>Tester#assertNot(mixed subject[, String message])</code></h3>

Asserts that the passed subject resolves to `false`.

```javascript
casper.test.assertNot(false, "Universe is still operational");
```

<h3 id="phantom_Casper_Tester_assertRaises"><code>Tester#assertRaises(Function fn, Array args[, String message])</code></h3>

Asserts that the provided function called with the given parameters
raises a javascript `Error`.

```javascript
casper.test.assertRaises(function(throwIt) {
    if (throwIt) {
        throw new Error('thrown');
    }
}, [true], 'Error has been raised.');
```

<h3 id="phantom_Casper_Tester_assertSelectorExists"><code>Tester#assertSelectorExists(String selector[, String message])</code></h3>

Asserts that at least an element matching the provided CSS3 selector
exists in remote DOM.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertSelectorExists('form[name="gs"]', 'google.fr provides a form');
});
```

<h3 id="phantom_Casper_Tester_assertResourceExists"><code>Tester#assertResourceExists(Function testFx[, String message])</code></h3>

The `testFx` is executed against all loaded asserts and the test passes
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

<h3 id="phantom_Casper_Tester_assertTextExists"><code>Tester#assertTextExists(String expected[, String message])</code></h3>

Asserts that body **plain text content** contains the given string.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertTextExists('google', 'page body contains "google"');
});
```

<h3 id="phantom_Casper_Tester_assertTitle"><code>Tester#assertTitle(String expected[, String message])</code></h3>

Asserts that title of the remote page equals to the expected one.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertTitle('Google', 'google.fr has the correct title');
});
```

<h3 id="phantom_Casper_Tester_assertType"><code>Tester#assertType(mixed input, String type[, String message])</code></h3>

Asserts that the provided input is of the given type.

```javascript
var casper = require('casper').create();
casper.test.assertType(42, "number", "Okay, 42 is a number");
casper.test.assertType([1, 2, 3], "array", "Yeah, we can test for arrays too =)");
```

<h3 id="phantom_Casper_Tester_assertUrlMatch"><code>Tester#assertUrlMatch(Regexp pattern[, String message])</code></h3>

Asserts that a the current page url matches the provided RegExp pattern.

```javascript
var casper = require('casper').create();
casper.start('http://www.google.fr/', function() {
    this.test.assertUrlMatch(/^http:\/\//', 'google.fr is served in http://');
});
```

<h3 id="phantom_Casper_Tester_colorize"><code>Tester#colorize(String message, String style)</code></h3>

Render a colorized output. Basically a proxy method for
`Casper.Colorizer#colorize()`.

<h3 id="phantom_Casper_Tester_comment"><code>Tester#comment(String message)</code></h3>

Writes a comment-style formatted message to stdout.

```javascript
var casper = require('casper').create();
casper.test.comment("Hi, I'm a comment");
```

<h3 id="phantom_Casper_Tester_error"><code>Tester#error(String message)</code></h3>

Writes an error-style formatted message to stdout.

```javascript
var casper = require('casper').create();
casper.test.error("Hi, I'm an error");
```

<h3 id="phantom_Casper_Tester_fail"><code>Tester#fail(String message)</code></h3>

Adds a failed test entry to the stack.

```javascript
var casper = require('casper').create();
casper.test.fail("Georges W. Bush");
```

<h3 id="phantom_Casper_Tester_formatMessage"><code>Tester#formatMessage(String message, String style)</code></h3>

Formats a message to highlight some parts of it. Only used internally by
the tester.

<h3 id="phantom_Casper_Tester_info"><code>Tester#info(String message)</code></h3>

Writes an info-style formatted message to stdout.

```javascript
var casper = require('casper').create();
casper.test.info("Hi, I'm an informative message.");
```

<h3 id="phantom_Casper_Tester_pass"><code>Tester#pass(String message)</code></h3>

Adds a successful test entry to the stack.

```javascript
var casper = require('casper').create();
casper.test.pass("Barrack Obama");
```

<h3 id="phantom_Casper_Tester_renderResults"><code>Tester#renderResults(Boolean exit, Number status, String save)</code></h3>

Render tests results, save results in an XUnit formatted file, and optionally exit phantomjs.

```javascript
var casper = require('casper').create();
// ...
casper.run(function() {
    // exists with status code 0 and saves XUnit formatted results
    // in test-results.xml
    this.test.renderResults(true, 0, 'test-results.xml');
});
```
