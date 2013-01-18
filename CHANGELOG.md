kasperJS Changelog
==================

XXXX-XX-XX, v1.1
----------------

This version is yet to be released, and will possibly be tagged as 2.0 as not-so-backward-compatible refactoring occured on the `master` branch. I don't know yet.

### Important Changes & Caveats

#### Testing framework refactoring

A new `Tester.begin()` method has been introduced to help organizing tests better:

```js
function Cow() {
    this.mowed = false;
    this.moo = function moo() {
        this.mowed = true; // mootable state: don't do that
        return 'moo!';
    };
}

// unit style synchronous test case
kasper.test.begin('Cow can moo', 2, function suite(test) {
    var cow = new Cow();
    test.assertEquals(cow.moo(), 'moo!');
    test.assert(cow.mowed);
    test.done();
});

// asynchronous test case
kasper.test.begin('kasperjs.org is navigable', 2, function suite(test) {
    kasper.start('http://kasperjs.org/', function() {
        test.assertTitleMatches(/kasperjs/i);
        this.clickLabel('Testing');
    });

    kasper.then(function() {
        test.assertUrlMatches(/testing\.html$/);
    });

    kasper.run(function() {
        test.done();
    });
});
```

Also, scraping and testing are now betterly separated in kasperJS, and bad code is now a bit less bad. That involves breaking up BC on some points though:

- The kasper object won't be created with a `test` reference if not invoked using the [`kasperjs test` command](http://kasperjs.org/testing.html#kasper-test-command), therefore the ability to run any test without calling it has been dropped. I know, get over it.
- Passing the planned number of tests to `kasper.done()` has been dropped as well, because `done()` may be never called at all when big troubles happen; rather use the new `begin()` method and provide the expected number of tests using the second argument:

```js
kasper.test.begin("Planning 4 tests", 4, function(test) {
    [1, 2, 3, 4].forEach(function() {
        test.assert(true);
    });
    test.done();
});
```

Last, all the kasper test suites have been upgraded to use the new testing features, you may want to have a look at the changes.

### Bugfixes & enhancements

None yet.

2013-01-17, v1.0.1
------------------

- fixed [#336](https://github.com/n1k0/kasperjs/issues/336) - Test result duration may have an exotic value
- Added `kasper.mouse.doubleclick()`
- fixed [#343](https://github.com/n1k0/kasperjs/issues/343) - Better script checks
- fixed an edge case with xunit export when `phantom.kasperScript` may be not defined

2012-12-24, v1.0.0
------------------

### Important Changes & Caveats

- PhantomJS 1.6.x support has been dropped. Both PhantomJS [1.7](http://phantomjs.org/release-1.7.html) & [1.8](http://phantomjs.org/release-1.8.html) will be supported.
- the deprecated `injector` module has been removed from the codebase (RIP dude)
- a [`1.0` maintenance branch](https://github.com/n1k0/kasperjs/tree/1.0) has been created
- kasperJS 1.1 development is now taking place on the `master` branch

### Bugfixes & enhancements

- fixed `page.initialized` event didn't get the initialized `WebPage` instance
- fixed a bug preventing `kasper.options.onPageInitialized()` from being called
- fixed [#215](https://github.com/n1k0/kasperjs/issues/215) - fixed broken `--fail-fast` option creating an endless loop on error
- fixed `Tester.renderFailureDetails()` which couldn't print failure details correctly in certain circumstances
- fixed `kasper.getHTML()` wasn't retrieving active frame contents when using `kasper.withFrame()`
- fixed [#327](https://github.com/n1k0/kasperjs/issues/327) - event handler for `page.confirm` always returns true
- merged PR [#322](https://github.com/n1k0/kasperjs/pull/322) - Support number in `kasper.withFrame()`
- fixed [#323](https://github.com/n1k0/kasperjs/issues/323) - `thenEvaluate()` should be updated to take the same parameters as `evaluate()`, while maintaining backwards compatibility.
- merged PR [#319](https://github.com/n1k0/kasperjs/pull/319), fixed [#209](https://github.com/n1k0/kasperjs/issues/209) - test duration has been added to XUnit XML result file.
- `kasper.userAgent()` does not require the instance to be started anymore
- dubious tests now have dedicated color & styling
- added hint printing when a possible `kasperjs` command call is detected

2012-12-14, v1.0.0-RC6
----------------------

I'm still expecting a 1.0 stable for Christmas. Feedback: bring it on.

### Important Changes & Caveats

#### Added experimental support for frames

A minimal convenient API has been added to kasper in order to ease the switch of current page context:

```js
kasper.start('tests/site/frames.html', function() {
    this.test.assertTitle('kasperJS frameset');
});

kasper.withFrame('frame1', function() {
    this.test.assertTitle('kasperJS frame 1');
});

kasper.then(function() {
    this.test.assertTitle('kasperJS frameset');
});
```

#### Reverted to emulated mouse events

Native mouse events didn't play well with (i)frames, because the computed element coordinates of the clicked element were erroneous.

So programmatic mouse events are reintroduced back into this corrective RC until a better solution is found.

### Bugfixes & enhancements

- merged [#269](https://github.com/n1k0/kasperjs/issues/269) - Windows Batch script: fixed unsupported spaces in path and argument splitting

2012-12-10, v1.0.0-RC5
----------------------

I told you there won't be an 1.0.0-RC5? I lied. Expect 1.0 stable for Christmas, probably.

### Important Changes & Caveats

#### kasper.evaluate() signature compatibility with PhantomJS

`kasper.evaluate()` method signature is now compatible with PhantomJS' one, so you can now write:

```js
kasper.evaluate(function(a, b) {
    return a === "foo" && b === "bar";
}, "foo", "bar"); // true
```

The old way to pass arguments has been kept backward compatible in order not to break your existing scripts though:

```js
kasper.evaluate(function(a, b) {
    return a === "foo" && b === "bar";
}, {a: "foo", b: "bar"}); // true
```

#### Specification of planned tests

In order to check that every planned test has actuall been executed, a new optional `planned` parameter has been added to `Tester.done()`:

```js
kasper.test.assert(true);
kasper.test.assert(true);
kasper.test.assert(true);
kasper.test.done(4);
```

Will trigger a failure:

```
fail: 4 tests planned, 3 tests executed.
```

That's especially useful in case a given test script is abruptly interrupted leaving you with no obvious way to know it and an erroneous success status.

The whole [CapserJS test suite](https://github.com/n1k0/kasperjs/tree/master/tests/) has been migrated to use this new feature.

#### Experimental support for popups

PhantomJS 1.7 ships with support for new opened pages — aka popups. kasperJS can now wait for a popup to be opened and loaded to react accordingly using the new [`kasper.waitForPopup()`](http://kasperjs.org/api.html#kasper.waitForPopup) and [`kasper.withPopup()`](http://kasperjs.org/api.html#kasper.withPopup) methods:

```js
kasper.start('http://foo.bar/').then(function() {
    this.test.assertTitle('Main page title');
    this.clickLabel('Open me a popup');
});

// this will wait for the popup to be opened and loaded
kasper.waitForPopup(/popup\.html$/, function() {
    this.test.assertEquals(this.popups.length, 1);
});

// this will set the popup DOM as the main active one only for time the
// step closure being executed
kasper.withPopup(/popup\.html$/, function() {
    this.test.assertTitle('Popup title');
});

// next step will automatically revert the current page to the initial one
kasper.then(function() {
    this.test.assertTitle('Main page title');
});
```

#### `kasper.mouseEvent()` now uses native events for most operations

Native mouse events from PhantomJS bring a far more accurate behavior.

Also, `kasper.mouseEvent()` will now directly trigger an error on failure instead of just logging an `error` event.

### Bugfixes & enhancements

- fixed [#308](https://github.com/n1k0/kasperjs/issues/308) & [#309](https://github.com/n1k0/kasperjs/issues/309) - proper module error backtraces
- fixed [#306](https://github.com/n1k0/kasperjs/issues/306) - Raise an explicit error on invalid test path
- fixed [#300](https://github.com/n1k0/kasperjs/issues/300) - Ensure that `findOne()` and `findAll()` observe the scope for XPath expressions, not just when passed CSS selectors
- fixed [#294](https://github.com/n1k0/kasperjs/issues/294) - Automatically fail test on any runtime error or timeout
- fixed [#281](https://github.com/n1k0/kasperjs/issues/281) - `kasper.evaluate()` should take an array as context not object
- fixed [#266](https://github.com/n1k0/kasperjs/issues/266) - Fix `tester` module and its self tests
- fixed [#268](https://github.com/n1k0/kasperjs/issues/266) - Wrong message on step timeout
- fixed [#215](https://github.com/n1k0/kasperjs/issues/215) - added a `--fail-fast` option to the `kasper test` command, in order to terminate a test suite execution as soon as any failure is encountered
- fixed [#274](https://github.com/n1k0/kasperjs/issues/274) - some headers couldn't be set
- fixed [#277](https://github.com/n1k0/kasperjs/issues/277) - multiline support in `ClientUtils.echo()`
- fixed [#282](https://github.com/n1k0/kasperjs/issues/282) - added support for remote client scripts loading with a new `remoteScripts` kasper option
- fixed [#290](https://github.com/n1k0/kasperjs/issues/#290) - add a simplistic RPM spec file to make it easier to (un)install kasperjs
- fixed [`utils.betterTypeOf()`](http://kasperjs.org/api.html#kasper.betterTypeOf) to properly handle `undefined` and `null` values
- fixed `kasper.die()` and `kasper.evaluateOrDie()` were not printing the error onto the console
- added JSON support to `require()`
- added [`Tester.assertTruthy()`](http://kasperjs.org/api.html#tester.assertTruthy) and [`Tester.assertFalsy()`](http://kasperjs.org/api.html#tester.assertFalsy)
- added [`kasper.sendKeys()`](http://kasperjs.org/api.html#kasper.sendKeys) to send native keyboard events to the element matching a given selector
- added [`kasper.getFormValues()`](http://kasperjs.org/api.html#kasper.getFormValues) to check for the field values of a given form
- added [`Tester.assertTextDoesntExist()`](http://kasperjs.org/api.html#tester.assertTextDoesntExist)
- added `Tester.assertFalse()` as an alias of `Tester.assertNot()`
- added `page.resource.requested` and `page.resource.received` events
- added [`translate.js`](https://github.com/n1k0/kasperjs/tree/master/samples/translate.js) and [`translate.coffee`](https://github.com/n1k0/kasperjs/tree/master/samples/translate.coffee) samples

2012-10-31, v1.0.0-RC4
----------------------

Next version should be 1.0.0 stable.

- fixed [#261](https://github.com/n1k0/kasperjs/issues/261) - Impossible to require CoffeeScript modules
- fixed [#262](https://github.com/n1k0/kasperjs/issues/262) - Injecting clientScripts is not working
- fixed [#259](https://github.com/n1k0/kasperjs/issues/259) - enhanced `Tester.assertField()` method, which can now tests for other field types than `input`s.
- fixed `kasper.getCurrentUrl()` could misbehave with encoded urls
- added [`kasper.echo()`](http://kasperjs.org/api.html#clientutils.echo) to print a message to the kasper console from the remote DOM environment
- added [`kasper.waitForText()`](http://kasperjs.org/api.html#kasper.waitForText) to wait for a given text to be present in page HTML contents
- added [`ClientUtils.getFieldValue()`](http://kasperjs.org/api.html#clientutils.getFieldValue)
- Local CoffeeScript version has been upgraded to 1.4.0

2012-10-23, v1.0.0-RC3
----------------------

### Important Changes & Caveats

- the `injector` module is now deprecated, but kept for backward compatibility purpose.
- **BC BREAK**: fixes [#220](https://github.com/n1k0/kasperjs/issues/220), [#237](https://github.com/n1k0/kasperjs/issues/237) - added a `waitTimeout` options, removed `defaultWaitTimeout` option.
- **BC BREAK** (for the better): fixes [#249](https://github.com/n1k0/kasperjs/issues/249) - default timeout functions don't `die()` anymore in tests
- **BC BREAK** (for the better): merged [#188](https://github.com/n1k0/kasperjs/issues/188) - Easy access to current response object;
  You can now access the current response object as the first parameter of step callbacks:

```javascript
require('kasper').create().start('http://www.google.fr/', function(response) {
    require('utils').dump(response);
}).run();
```

That gives:

```
$ kasperjs dump-headers.js
{
    "contentType": "text/html; charset=UTF-8",
    "headers": [
        {
            "name": "Date",
            "value": "Thu, 18 Oct 2012 08:17:29 GMT"
        },
        {
            "name": "Expires",
            "value": "-1"
        },
        // ... lots of other headers
    ],
    "id": 1,
    "redirectURL": null,
    "stage": "end",
    "status": 200,
    "statusText": "OK",
    "time": "2012-10-18T08:17:37.068Z",
    "url": "http://www.google.fr/"
}
```

To fetch a particular header by its name:

```javascript
require('kasper').create().start('http://www.google.fr/', function(response) {
    this.echo(response.headers.get('Date'));
}).run();
```

That gives:

```javascript
$ kasperjs dump-single-header.js
Thu, 18 Oct 2012 08:26:34 GMT
```

The documentation has been [updated accordingly](http://kasperjs.org/api.html#kasper.then.callbacks).

### Bugfixes & enhancements

- merged [#234](https://github.com/n1k0/kasperjs/issues/234) - New Windows Loader written in Batch. Python is no more a requirement for using kasperJS on Windows. New installation instructions are [available](http://kasperjs.org/installation.html#windows).
- a new `onWaitTimeout` option has been added, to allow defining a default behavior when a `waitFor*` function times out.
- [kasper.resourceExists()](http://kasperjs.org/api.html#kasper.resourceExists) and related functions now checks for non HTTP-404 received responses.
- fixed [#167](https://github.com/n1k0/kasperjs/issues/167) - fixed opening truncated/uncomplete root urls may give erroneous HTTP statuses
- closes [#205](https://github.com/n1k0/kasperjs/issues/205) - [`debugHTML()`](http://kasperjs.org/api.html#kasper.debugHTML) can have a selector passed; added [`getHTML()`](http://kasperjs.org/api.html#kasper.getHTML)
- closes [#230](https://github.com/n1k0/kasperjs/issues/230) - added [`ClientUtils.getElementsBound()`](http://kasperjs.org/api.html#clientutils.getElementsBounds) and [`kasper.getElementsBound()`](http://kasperjs.org/api.html#kasper.getElementsBounds)
- fixed [#235](https://github.com/n1k0/kasperjs/issues/235) - updated `kasper.evaluate()` to use phantomjs >= 1.6 native one. As a consequence, **the `injector` module is marked as deprecated**.
- fixed [#250](https://github.com/n1k0/kasperjs/issues/250) - prevent self tests to be run using the standard `kasper test` command
- fixed [#254](https://github.com/n1k0/kasperjs/issues/254) - fix up one use of qsa, hit when filling forms with missing elements
- [fixed](https://github.com/n1k0/kasperjs/commit/ef6c1828c7b64e1cf99b98e27600d0b63308cad3) edge case when current document url couldn't be properly decoded

2012-10-01, v1.0.0-RC2
----------------------

### Important Changes & Caveats

- **PhantomJS 1.6 is now the minimal requirement**, PhantomJS 1.7 is supported.
- kasperJS continues to ship with its own implementation of CommonJS' module pattern, due to the way it has to work to offer its own executable. While the implementations are nearly the same, **100% compatibility is not guaranteed**.

### Bugfixes & enhancements

- fixed [#119](https://github.com/n1k0/kasperjs/issues/119) - `kasper.currentHTTPStatus` now defaults to `null` when resource are loaded using the `file://` protocol
- fixed [#130](https://github.com/n1k0/kasperjs/issues/130) - added a `--no-colors` option to the `kasper test` command to skip output coloration
- fixed [#153](https://github.com/n1k0/kasperjs/issues/153) - erroneous mouse event results when `event.preventDefault()` was used.
- fixed [#164](https://github.com/n1k0/kasperjs/issues/164) - ability to force CLI parameters as strings (see [related documentation](http://kasperjs.org/cli.html#raw)).
- fixed [#178](https://github.com/n1k0/kasperjs/issues/178) - added `kasper.getPageContent()` to access raw page body contents on non-html received content-types.
- fixed [#180](https://github.com/n1k0/kasperjs/issues/180) - kasperJS tests are now run against a local HTTP test server. A new `kasper selftest` command has been added as well.
- fixed [#189](https://github.com/n1k0/kasperjs/issue/189) - fixed invalid XML due to message colorization
- fixed [#197](https://github.com/n1k0/kasperjs/pull/197) & [#240](https://github.com/n1k0/kasperjs/pull/240/) - Added new tester methods:
  * [`assertField`](http://kasperjs.org/api.html#tester.assertField)
  * [`assertSelectorHasText`](http://kasperjs.org/api.html#tester.assertSelectorHasText)
  * [`assertSelectorDoesntHaveText`](http://kasperjs.org/api.html#tester.assertSelectorDoesntHaveText)
  * [`assertVisible`](http://kasperjs.org/api.html#tester.assertVisible)
  * [`assertNotVisible`](http://kasperjs.org/api.html#tester.assertNotVisible)
- fixed [#202](https://github.com/n1k0/kasperjs/pull/202) - Fix test status timeouts when running multiple suites
- fixed [#204](https://github.com/n1k0/kasperjs/pull/204) - Fix for when the url is changed via javascript
- fixed [#210](https://github.com/n1k0/kasperjs/pull/210) - Changed `escape` to `encodeURIComponent` for downloading binaries via POST
- fixed [#216](https://github.com/n1k0/kasperjs/pull/216) - Change clientutils to be able to set a global scope
- fixed [#219](https://github.com/n1k0/kasperjs/issues/219) - ease chaining of `run()` calls ([more explanations](https://groups.google.com/forum/#!topic/kasperjs/jdQ-CrgnUd8))
- fixed [#222](https://github.com/n1k0/kasperjs/pull/222) & [#211](https://github.com/n1k0/kasperjs/issues/211) - Change mouse event to include an X + Y value for click position
- fixed [#231](https://github.com/n1k0/kasperjs/pull/231) - added `--pre` and `--post` options to the `kasperjs test` command to load test files before and after the execution of testsuite
- fixed [#232](https://github.com/n1k0/kasperjs/issues/232) - symlink resolution in the ruby version of the `kasperjs` executable
- fixed [#236](https://github.com/n1k0/kasperjs/issues/236) - fixed `kasper.exit` returned `this` after calling `phantom.exit()` which may caused PhantomJS to hang
- fixed [#252](https://github.com/n1k0/kasperjs/issues/252) - better form.fill() error handling
- added [`ClientUtils.getDocumentHeight()`](http://kasperjs.org/api.html#clientutils.getDocumentHeight)
- added [`toString()`](http://kasperjs.org/api.html#kasper.toString) and [`status()`](http://kasperjs.org/api.html#kasper.status) methods to `kasper` prototype.

2012-06-26, v1.0.0-RC1
----------------------

### PhantomJS 1.5 & 1.6

- fixed [#119](https://github.com/n1k0/kasperjs/issues/119) - HTTP status wasn't properly caught
- fixed [#132](https://github.com/n1k0/kasperjs/issues/132) - added ability to include js/coffee files using a dedicated option when using the [`kasper test` command](http://kasperjs.org/testing.html)
- fixed [#140](https://github.com/n1k0/kasperjs/issues/140) - `kasper test` now resolves local paths urls
- fixed [#148](https://github.com/n1k0/kasperjs/issues/148) - [`utils.isWebPage()`](http://kasperjs.org/api.html#utils.isWebPage) was broken
- fixed [#149](https://github.com/n1k0/kasperjs/issues/149) - [`ClientUtils.fill()`](http://kasperjs.org/api.html#kasper.fill) was searching elements globally
- fixed [#154](https://github.com/n1k0/kasperjs/issues/154) - firing the `change` event after a field value has been set
- fixed [#144](https://github.com/n1k0/kasperjs/issues/144) - added a [`safeLogs` option](http://kasperjs.org/api.html#kasper.options) to blur password values in debug logs. **This option is set to `true` by default.**
- added [`kasper.userAgent()`](http://kasperjs.org/api.html#kasper.userAgent) to ease a more dynamic setting of user-agent string
- added [`Tester.assertTitleMatch()`](http://kasperjs.org/api.html#tester.assertTitleMatch) method
- added [`utils.getPropertyPath()`](http://kasperjs.org/api.html#utils.getPropertyPath)
- added [`kasper.captureBase64()`](http://kasperjs.org/api.html#kasper.captureBase64) for rendering screen captures as base64 strings - closes [#150](https://github.com/n1k0/kasperjs/issues/150)
- added [`kasper.reload()`](http://kasperjs.org/api.html#kasper.reload)
- fixed failed test messages didn't expose the subject correctly
- switched to more standard `.textContent` property to get a node text; this allows a better compatibility of the clientutils bookmarklet with non-webkit browsers
- kasper modules now all use [javascript strict mode](http://www.nczonline.net/blog/2012/03/13/its-time-to-start-using-javascript-strict-mode/)

### PhantomJS >= 1.6 supported features

- added support of custom headers sending in outgoing request - refs [#137](https://github.com/n1k0/kasperjs/issues/137))
- added support for `prompt()` and `confirm()` - closes [#125](https://github.com/n1k0/kasperjs/issues/125)
- fixed [#157](https://github.com/n1k0/kasperjs/issues/157) - added support for PhantomJS 1.6 `WebPage#zoomFactor`
- added `url.changed` & `navigation.requested` events - refs [#151](https://github.com/n1k0/kasperjs/issues/151)

2012-06-04, v0.6.10
-------------------

- fixed [#73](https://github.com/n1k0/kasperjs/issues/73) - `kasper.download()` not working correctly with binaries
- fixed [#129](https://github.com/n1k0/kasperjs/issues/129) - Can't put `//` comments in evaluate() function
- closed [#130](https://github.com/n1k0/kasperjs/issues/130) - Added a `Dummy` [colorizer](http://kasperjs.org/api.html#colorizer) class, in order to disable colors in console output
- fixed [#133](https://github.com/n1k0/kasperjs/issues/133) - updated and fixed documentation about [extensibility](http://kasperjs.org/extending.html)
- added `kasper.clickLabel()` for clicking on an element found by its `innerText` content

As a side note, the official website monolithic page has been split across several ones: http://kasperjs.org/

2012-05-29, v0.6.9
------------------

- **BC BREAK:** PhantomJS 1.5 is now the minimal PhantomJS version supported.
- fixed [#114](https://github.com/n1k0/kasperjs/issues/114) - ensured client-side utils are injected before any `evaluate()` call
- merged [#89](https://github.com/n1k0/kasperjs/pull/89) - Support for more mouse events (@nrabinowitz)
- [added a new `error` event, better error reporting](https://github.com/n1k0/kasperjs/commit/2e6988ae821b3251e063d11ba28af59b0683852a)
- fixed [#117](https://github.com/n1k0/kasperjs/issues/117) - `fill()` coulnd't `submit()` a form with a submit input named *submit*
- merged [#122](https://github.com/n1k0/kasperjs/pull/122) - allow downloads to be triggered by more than just `GET` requests
- closed [#57](https://github.com/n1k0/kasperjs/issues/57) - added context to emitted test events + complete assertion framework refactor
- fixed loaded resources array is now reset adequately [reference discussion](https://groups.google.com/forum/?hl=fr?fromgroups#!topic/kasperjs/TCkNzrj1IoA)
- fixed incomplete error message logged when passed an erroneous selector (xpath and css)

2012-05-20, v0.6.8
------------------

- added support for [XPath selectors](http://kasperjs.org/#selectors)
- added `Tester.assertNotEquals()` ([@juliangruber](https://github.com/juliangruber))
- fixed [#109](https://github.com/n1k0/kasperjs/issues/109) - CLI args containing `=` (equals sign) were not being parsed properly

2012-05-12, v0.6.7
------------------

- fixes [#107](https://github.com/n1k0/kasperjs/issues/107): client utils were possibly not yet being injected and available when calling `Capser.base64encode()` from some events
- merged [PR #96](https://github.com/n1k0/kasperjs/pull/96): make python launcher use `os.execvp()` instead of `subprocess.Popen()` ([@jart](https://github.com/jart)):
  > This patch fixes a bug where kasperjs' python launcher process won't pass along kill
  > signals to the phantomjs subprocess. This patch works by using an exec system call
  > which causes the phantomjs subprocess to completely replace the kasperjs parent
  > process (while maintaining the same pid). This patch also has the added benefit of
  > saving 10 megs or so of memory because the python process is discarded.
- fixes [#109](https://github.com/n1k0/kasperjs/issues/109) - CLI args containing `=` (equals sign) were not parsed properly
- fixes [#100](https://github.com/n1k0/kasperjs/issues/100) & [#110](https://github.com/n1k0/kasperjs/issues/110) - *googlepagination* sample was broken
- merged #103 - added `Tester.assertNotEquals` method (@juliangruber)

2012-04-27, v0.6.6
------------------

- **BC BREAK:**: moved the `page.initialized` event to where it should have always been, and is now using native phantomjs `onInitialized` event
- fixed [#95](https://github.com/n1k0/kasperjs/issues/95) - `Tester.assertSelectorExists` was broken

2012-03-28, v0.6.5
------------------

- **BC BREAK:** reverted 8347278 (refs [#34](https://github.com/n1k0/kasperjs/issues/34) and added a new `clear()` method to *close* a page
    You now have to call `kasper.clear()` if you want to stop javascript execution within the remote DOM environment.
- **BC BREAK:** removed `fallbackToHref` option handling in `ClientUtils.click()` (refs [#63](https://github.com/n1k0/kasperjs/issues/63))
- `tester.findTestFiles()` now returns results in predictable order
- added `--log-level` and `--direct` options to `kasper test` command
- fixed 0.6.4 version number in `bootstrap.js`
- centralized version number to package.json
- ensured compatibility with PhantomJS 1.5

2012-02-09, v0.6.4
------------------

- fixed `kasperjs` command wasn't passing phantomjs native option in the correct order, resulting them not being taken into account by phantomjs engine:
  - fixed [#49](https://github.com/n1k0/kasperjs/issues/49) - `kasperjs` is not sending `--ssl-ignore-errors`
  - fixed [#50](https://github.com/n1k0/kasperjs/issues/50) - Cookies not being set when passing `--cookies-file` option
- fixed Python3 compatibility of the `kasperjs` executable

2012-02-05, v0.6.3
------------------

- fixed [#48](https://github.com/n1k0/kasperjs/issues/48) - XML Output file doesn't have classpath populated with file name
- refs [#46](https://github.com/n1k0/kasperjs/issues/46) - added value details to Tester `fail` event
- new site design, new [domain](http://kasperjs.org/), enhanced & updated docs

2012-01-19, v0.6.2
------------------

- fixed [#41](https://github.com/n1k0/kasperjs/issues/41) - injecting kasperjs lib crashes `cmd.exe` on Windows 7
- fixed [#42](https://github.com/n1k0/kasperjs/issues/42) - Use file name of test script as 'classname' in JUnit XML report (@mpeltonen)
- fixed [#43](https://github.com/n1k0/kasperjs/issues/43) - Exit status not reported back to caller
- suppressed colorized output syntax for windows; was making output hard to read
- added patchy `fs.isWindows()` method
- added `--xunit=<filename>` cli option to `$ kasperjs test` command for saving xunit results, eg.:

      $ kasperjs test tests/suites --xunit=build-result.xml


2012-01-16, v0.6.1
------------------

- restablished js-emulated click simulation first, then native QtWebKit
  events as a fallback; some real world testing have surprinsingly proven the former being often
  more efficient than the latter
- fixed kasperjs executable could not handle a `PHANTOMJS_EXECUTABLE` containing spaces
- fixed kasper could not be used without the executable [as documented](http://kasperjs.org/#faq-executable)
- fixed wrong `debug` log level on `ClientUtils.click()` error; set to `error`

Please check the [updated documentation](http://kasperjs.org).

2012-01-12, v0.6.0
------------------

- **BC BREAK:** `kasper.click()` now uses native Webkit mouse events instead of previous crazy utopic javascript emulation
- **BC BREAK:** All errors thrown by kasperJS core are of the new `kasperError` type
- **BC BREAK:** removed obsolete `replaceFunctionPlaceholders()`
- *Deprecated*: `kasper.extend()` method has been deprecated; use natural javascript extension mechanisms instead (see samples)
- added `$ kasperjs test` command for running split test suites
- `kasper.open()` can now perform HTTP `GET`, `POST`, `PUT`, `DELETE` and `HEAD` operations
- commonjs/nodejs-like module exports implementation
- ported nodejs' `events` module to kasperjs; lots of events added, plus some value filtering capabilities
- introduced the `mouse` module to handle native Webkit mouse events
- added support for `RegExp` input in `kasper.resourceExists()`
- added printing of source file path for any uncaught exception printed onto the console
- added an emulation of stack trace printing (but PhantomJS will have to upgrade its javascript engine for it to be fully working though)

Please check the [updated documentation](http://kasperjs.org).

---

2011-12-25, v0.4.2
------------------

- merged PR #30 - Add request method and request data to the `base64encode()` method (@jasonlfunk)
- `kasperjs` executable now gracefully exists on KeyboardInterrupt
- added `kasper.download()` method, for downloading any resource and save it onto the filesystem

---

2011-12-21, v0.4.1
------------------

- fixed #31 - replaced bash executable script by a Python one

---

2011-12-20, v0.4.0
------------------

- first numbered version
