CasperJS ships with a handful set of tools to be used as a functional
testing framework. For example, let's test write a tests suite for
testing google search (yes, you read it well):

```javascript
var casper = require('casper').create();

casper.start('http://www.google.fr/', function() {
    this.test.assertTitle('Google', 'google homepage title is the one expected');
    this.test.assertExists('form[action="/search"]', 'main form is found');
    this.fill('form[action="/search"]', {
        q: 'foo'
    }, true);
});

casper.then(function() {
    this.test.assertTitle('foo - Recherche Google', 'google title is ok');
    this.test.assertUrlMatch(/q=foo/, 'search term has been submitted');
    this.test.assertEval(function() {
        return __utils__.findAll('h3.r').length >= 10;
    }, 'google search for "foo" retrieves 10 or more results');
});

casper.run(function() {
    this.test.renderResults(true);
});
```

As you can see, `casper.test` is a reference to a `tester.Tester` object
instance, which is used to make the assertions and render the results.

<span class="label label-info">Note</span> You can find the whole
`tester.Tester` API documentation in the [dedicated section](#phantom_Casper_Tester).

Now run the tests suite:

```
$ casperjs samples/googletest.js
```

You'll probably get something like this:

![capture](images/testsuiteok.png)

In case any assertion fails, you'd rather get something like the
following:

![capture](images/testsuitefail.png)

* * * * *

### Exporting results in *xUnit* format

CasperJS can export the results of the test suite to an xUnit XML file,
which is compatible with continuous integration tools such as
[Jenkins](http://jenkins-ci.org/). To save the xUnit log of your test
suite to a `log.xml` file, you can process this way:

```javascript
casper.run(function() {
    this.test.renderResults(true, 0, 'log.xml');
});
```

A cooler way is to add an option to your script using CLI argument
parsing:

```javascript
casper.run(function() {
    this.test.renderResults(true, 0, this.cli.get('save') || false);
});
```

Then you can run:

```
$ casperjs test.js --save=log.xml
```

* * * * *

### CasperJS tests

CasperJS has its own unit and functional test suite, located in the
`tests` subfolder. More tests will be added in the future. To run the
test suite, from the root of a checkout of the casperjs repository:

```
$ cd /path/to/casperjs
$ casperjs test tests/suites
```

* * * * *

### Organizing your tests

Of course writing all your tests in a single file may be painful, so you
can split them across files.

<div class="alert-message block-message">
  <p>
    <span class="label label-important">Important</span>
    There are <strong>two important conditions</strong> for splitting
    your test suite across several files:
  </p>
  <ol class="bottom">
    <li>
      <p>
        <strong>Not</strong> to create a new <code>Casper</code> instance
        in a split test file;
      </p>
    </li>
    <li>
      <p>
        To call the <code>Tester.done()</code> method when all the tests
        contained in a single file have been executed.
      </p>
    </li>
  </ol>
</div>

Here's a first sample test file:

```javascript
// file: /path/to/test/dir/test1.js

casper.test.comment('My first test file');
casper.test.assert(true, "true is so true");
casper.test.done(); // I must be called!
```

And a second one:

```javascript
// file: /path/to/test/dir/test2.js

casper.test.comment('This is my second test file, a bit more async');

casper.start('http://my.location.tld/', function() {
    this.test.assertNot(false, "false is so false");
});

casper.run(function() {
    this.test.done(); // I must be called once all the async stuff has been executed
});
```

<span class="label label-info">Hint</span> As you can see, a standard `Casper`
class instance, stored in a `casper` variable, is already available and exposed
to each test file; that's because a configured one's already available as stated
previously.

The `casperjs test` command comes handy for running all the tests found
at a given location:

```
$ casperjs test /path/to/test/dir/
```

This is theoretically what you will get:

![image](images/split-test-results.png)

Also, you can of course run a single test file:

```javascript
$ casperjs test /path/to/test/dir/test1.js
```

Some options are available using the `casper test` command:

- `--xunit=<filename>` will export test suite results in a xUnit XML file
- `--direct` will output log messages directly to the console
- `--log-level=<logLevel>` sets the logging level (see the [related section](#logging))

* * * * *

### Extending Casper for Testing

The `$ casper test [path]` command is just a shortcut for
`$ casper /path/to/casperjs/tests/run.js [path]`; so if you want to
extend Casper capabilities for your tests, your best bet is to write
your own runner and extend the casper object instance from there.

<span class="label label-info">Hint</span> You can find the default runner code in
[`./tests/run.js`](https://github.com/n1k0/casperjs/blob/master/tests/run.js).
