CasperJS Changelog
==================

XXXX-XX-XX, v1.0.0
------------------

This version is yet to be released.

- closes [#230](https://github.com/n1k0/casperjs/issues/230) - added [`ClientUtils.getElementsBound()`](http://casperjs.org/api.html#clientutils.getElementsBounds) and [`Casper.getElementsBound()`](http://casperjs.org/api.html#casper.getElementsBounds)

2012-10-01, v1.0.0-RC2
----------------------

### Important Changes & Caveats

- **PhantomJS 1.6 is now the minimal requirement**, PhantomJS 1.7 is supported.
- CasperJS continues to ship with its own implementation of CommonJS' module pattern, due to the way it has to work to offer its own executable. While the implementations are nearly the same, **100% compatibility is not guaranteed**.

### Bugfixes & enhancements

- fixed [#119](https://github.com/n1k0/casperjs/issues/119) - `Casper.currentHTTPStatus` now defaults to `null` when resource are loaded using the `file://` protocol
- fixed [#130](https://github.com/n1k0/casperjs/issues/130) - added a `--no-colors` option to the `casper test` command to skip output coloration
- fixed [#153](https://github.com/n1k0/casperjs/issues/153) - erroneous mouse event results when `event.preventDefault()` was used.
- fixed [#164](https://github.com/n1k0/casperjs/issues/164) - ability to force CLI parameters as strings (see [related documentation](http://casperjs.org/cli.html#raw)).
- fixed [#178](https://github.com/n1k0/casperjs/issues/178) - added `Casper.getPageContent()` to access raw page body contents on non-html received content-types.
- fixed [#180](https://github.com/n1k0/casperjs/issues/180) - CasperJS tests are now run against a local HTTP test server. A new `casper selftest` command has been added as well.
- fixed [#189](https://github.com/n1k0/casperjs/issue/189) - fixed invalid XML due to message colorization
- fixed [#197](https://github.com/n1k0/casperjs/pull/197) & [#240](https://github.com/n1k0/casperjs/pull/240/) - Added new tester methods:
  * [`assertField`](http://casperjs.org/api.html#tester.assertField)
  * [`assertSelectorHasText`](http://casperjs.org/api.html#tester.assertSelectorHasText)
  * [`assertSelectorDoesntHaveText`](http://casperjs.org/api.html#tester.assertSelectorDoesntHaveText)
  * [`assertVisible`](http://casperjs.org/api.html#tester.assertVisible)
  * [`assertNotVisible`](http://casperjs.org/api.html#tester.assertNotVisible)
- fixed [#202](https://github.com/n1k0/casperjs/pull/202) - Fix test status timeouts when running multiple suites
- fixed [#204](https://github.com/n1k0/casperjs/pull/204) - Fix for when the url is changed via javascript
- fixed [#210](https://github.com/n1k0/casperjs/pull/210) - Changed `escape` to `encodeURIComponent` for downloading binaries via POST
- fixed [#216](https://github.com/n1k0/casperjs/pull/216) - Change clientutils to be able to set a global scope
- fixed [#219](https://github.com/n1k0/casperjs/issues/219) - ease chaining of `run()` calls ([more explanations](https://groups.google.com/forum/#!topic/casperjs/jdQ-CrgnUd8))
- fixed [#222](https://github.com/n1k0/casperjs/pull/222) & [#211](https://github.com/n1k0/casperjs/issues/211) - Change mouse event to include an X + Y value for click position
- fixed [#231](https://github.com/n1k0/casperjs/pull/231) - added `--pre` and `--post` options to the `casperjs test` command to load test files before and after the execution of testsuite
- fixed [#232](https://github.com/n1k0/casperjs/issues/232) - symlink resolution in the ruby version of the `casperjs` executable
- fixed [#236](https://github.com/n1k0/casperjs/issues/236) - fixed `Casper.exit` returned `this` after calling `phantom.exit()` which may caused PhantomJS to hang
- added [`ClientUtils.getDocumentHeight()`](http://casperjs.org/api.html#clientutils.getDocumentHeight)
- added [`toString()`](http://casperjs.org/api.html#casper.toString) and [`status()`](http://casperjs.org/api.html#casper.status) methods to `Casper` prototype.

2012-06-26, v1.0.0-RC1
----------------------

### PhantomJS 1.5 & 1.6

- fixed [#119](https://github.com/n1k0/casperjs/issues/119) - HTTP status wasn't properly caught
- fixed [#132](https://github.com/n1k0/casperjs/issues/132) - added ability to include js/coffee files using a dedicated option when using the [`casper test` command](http://casperjs.org/testing.html)
- fixed [#140](https://github.com/n1k0/casperjs/issues/140) - `casper test` now resolves local paths urls
- fixed [#148](https://github.com/n1k0/casperjs/issues/148) - [`utils.isWebPage()`](http://casperjs.org/api.html#utils.isWebPage) was broken
- fixed [#149](https://github.com/n1k0/casperjs/issues/149) - [`ClientUtils.fill()`](http://casperjs.org/api.html#casper.fill) was searching elements globally
- fixed [#154](https://github.com/n1k0/casperjs/issues/154) - firing the `change` event after a field value has been set
- fixed [#144](https://github.com/n1k0/casperjs/issues/144) - added a [`safeLogs` option](http://casperjs.org/api.html#casper.options) to blur password values in debug logs. **This option is set to `true` by default.**
- added [`Casper.userAgent()`](http://casperjs.org/api.html#casper.userAgent) to ease a more dynamic setting of user-agent string
- added [`Tester.assertTitleMatch()`](http://casperjs.org/api.html#tester.assertTitleMatch) method
- added [`utils.getPropertyPath()`](http://casperjs.org/api.html#utils.getPropertyPath)
- added [`Casper.captureBase64()`](http://casperjs.org/api.html#casper.captureBase64) for rendering screen captures as base64 strings - closes [#150](https://github.com/n1k0/casperjs/issues/150)
- added [`Casper.reload()`](http://casperjs.org/api.html#casper.reload)
- fixed failed test messages didn't expose the subject correctly
- switched to more standard `.textContent` property to get a node text; this allows a better compatibility of the clientutils bookmarklet with non-webkit browsers
- casper modules now all use [javascript strict mode](http://www.nczonline.net/blog/2012/03/13/its-time-to-start-using-javascript-strict-mode/)

### PhantomJS >= 1.6 supported features

- added support of custom headers sending in outgoing request - refs [#137](https://github.com/n1k0/casperjs/issues/137))
- added support for `prompt()` and `confirm()` - closes [#125](https://github.com/n1k0/casperjs/issues/125)
- fixed [#157](https://github.com/n1k0/casperjs/issues/157) - added support for PhantomJS 1.6 `WebPage#zoomFactor`
- added `url.changed` & `navigation.requested` events - refs [#151](https://github.com/n1k0/casperjs/issues/151)

2012-06-04, v0.6.10
-------------------

- fixed [#73](https://github.com/n1k0/casperjs/issues/73) - `Casper.download()` not working correctly with binaries
- fixed [#129](https://github.com/n1k0/casperjs/issues/129) - Can't put `//` comments in evaluate() function
- closed [#130](https://github.com/n1k0/casperjs/issues/130) - Added a `Dummy` [colorizer](http://casperjs.org/api.html#colorizer) class, in order to disable colors in console output
- fixed [#133](https://github.com/n1k0/casperjs/issues/133) - updated and fixed documentation about [extensibility](http://casperjs.org/extending.html)
- added `Casper.clickLabel()` for clicking on an element found by its `innerText` content

As a side note, the official website monolithic page has been split across several ones: http://casperjs.org/

2012-05-29, v0.6.9
------------------

- **BC BREAK:** PhantomJS 1.5 is now the minimal PhantomJS version supported.
- fixed [#114](https://github.com/n1k0/casperjs/issues/114) - ensured client-side utils are injected before any `evaluate()` call
- merged [#89](https://github.com/n1k0/casperjs/pull/89) - Support for more mouse events (@nrabinowitz)
- [added a new `error` event, better error reporting](https://github.com/n1k0/casperjs/commit/2e6988ae821b3251e063d11ba28af59b0683852a)
- fixed [#117](https://github.com/n1k0/casperjs/issues/117) - `fill()` coulnd't `submit()` a form with a submit input named *submit*
- merged [#122](https://github.com/n1k0/casperjs/pull/122) - allow downloads to be triggered by more than just `GET` requests
- closed [#57](https://github.com/n1k0/casperjs/issues/57) - added context to emitted test events + complete assertion framework refactor
- fixed loaded resources array is now reset adequately [reference discussion](https://groups.google.com/forum/?hl=fr?fromgroups#!topic/casperjs/TCkNzrj1IoA)
- fixed incomplete error message logged when passed an erroneous selector (xpath and css)

2012-05-20, v0.6.8
------------------

- added support for [XPath selectors](http://casperjs.org/#selectors)
- added `Tester.assertNotEquals()` ([@juliangruber](https://github.com/juliangruber))
- fixed [#109](https://github.com/n1k0/casperjs/issues/109) - CLI args containing `=` (equals sign) were not being parsed properly

2012-05-12, v0.6.7
------------------

- fixes [#107](https://github.com/n1k0/casperjs/issues/107): client utils were possibly not yet being injected and available when calling `Capser.base64encode()` from some events
- merged [PR #96](https://github.com/n1k0/casperjs/pull/96): make python launcher use `os.execvp()` instead of `subprocess.Popen()` ([@jart](https://github.com/jart)):
  > This patch fixes a bug where casperjs' python launcher process won't pass along kill
  > signals to the phantomjs subprocess. This patch works by using an exec system call
  > which causes the phantomjs subprocess to completely replace the casperjs parent
  > process (while maintaining the same pid). This patch also has the added benefit of
  > saving 10 megs or so of memory because the python process is discarded.
- fixes [#109](https://github.com/n1k0/casperjs/issues/109) - CLI args containing `=` (equals sign) were not parsed properly
- fixes [#100](https://github.com/n1k0/casperjs/issues/100) & [#110](https://github.com/n1k0/casperjs/issues/110) - *googlepagination* sample was broken
- merged #103 - added `Tester.assertNotEquals` method (@juliangruber)

2012-04-27, v0.6.6
------------------

- **BC BREAK:**: moved the `page.initialized` event to where it should have always been, and is now using native phantomjs `onInitialized` event
- fixed [#95](https://github.com/n1k0/casperjs/issues/95) - `Tester.assertSelectorExists` was broken

2012-03-28, v0.6.5
------------------

- **BC BREAK:** reverted 8347278 (refs [#34](https://github.com/n1k0/casperjs/issues/34) and added a new `clear()` method to *close* a page
    You now have to call `casper.clear()` if you want to stop javascript execution within the remote DOM environment.
- **BC BREAK:** removed `fallbackToHref` option handling in `ClientUtils.click()` (refs [#63](https://github.com/n1k0/casperjs/issues/63))
- `tester.findTestFiles()` now returns results in predictable order
- added `--log-level` and `--direct` options to `casper test` command
- fixed 0.6.4 version number in `bootstrap.js`
- centralized version number to package.json
- ensured compatibility with PhantomJS 1.5

2012-02-09, v0.6.4
------------------

- fixed `casperjs` command wasn't passing phantomjs native option in the correct order, resulting them not being taken into account by phantomjs engine:
  - fixed [#49](https://github.com/n1k0/casperjs/issues/49) - `casperjs` is not sending `--ssl-ignore-errors`
  - fixed [#50](https://github.com/n1k0/casperjs/issues/50) - Cookies not being set when passing `--cookies-file` option
- fixed Python3 compatibility of the `casperjs` executable

2012-02-05, v0.6.3
------------------

- fixed [#48](https://github.com/n1k0/casperjs/issues/48) - XML Output file doesn't have classpath populated with file name
- refs [#46](https://github.com/n1k0/casperjs/issues/46) - added value details to Tester `fail` event
- new site design, new [domain](http://casperjs.org/), enhanced & updated docs

2012-01-19, v0.6.2
------------------

- fixed [#41](https://github.com/n1k0/casperjs/issues/41) - injecting casperjs lib crashes `cmd.exe` on Windows 7
- fixed [#42](https://github.com/n1k0/casperjs/issues/42) - Use file name of test script as 'classname' in JUnit XML report (@mpeltonen)
- fixed [#43](https://github.com/n1k0/casperjs/issues/43) - Exit status not reported back to caller
- suppressed colorized output syntax for windows; was making output hard to read
- added patchy `fs.isWindows()` method
- added `--xunit=<filename>` cli option to `$ casperjs test` command for saving xunit results, eg.:

      $ casperjs test tests/suites --xunit=build-result.xml


2012-01-16, v0.6.1
------------------

- restablished js-emulated click simulation first, then native QtWebKit
  events as a fallback; some real world testing have surprinsingly proven the former being often
  more efficient than the latter
- fixed casperjs executable could not handle a `PHANTOMJS_EXECUTABLE` containing spaces
- fixed casper could not be used without the executable [as documented](http://casperjs.org/#faq-executable)
- fixed wrong `debug` log level on `ClientUtils.click()` error; set to `error`

Please check the [updated documentation](http://casperjs.org).

2012-01-12, v0.6.0
------------------

- **BC BREAK:** `Casper.click()` now uses native Webkit mouse events instead of previous crazy utopic javascript emulation
- **BC BREAK:** All errors thrown by CasperJS core are of the new `CasperError` type
- **BC BREAK:** removed obsolete `replaceFunctionPlaceholders()`
- *Deprecated*: `Casper.extend()` method has been deprecated; use natural javascript extension mechanisms instead (see samples)
- added `$ casperjs test` command for running split test suites
- `Casper.open()` can now perform HTTP `GET`, `POST`, `PUT`, `DELETE` and `HEAD` operations
- commonjs/nodejs-like module exports implementation
- ported nodejs' `events` module to casperjs; lots of events added, plus some value filtering capabilities
- introduced the `mouse` module to handle native Webkit mouse events
- added support for `RegExp` input in `Casper.resourceExists()`
- added printing of source file path for any uncaught exception printed onto the console
- added an emulation of stack trace printing (but PhantomJS will have to upgrade its javascript engine for it to be fully working though)

Please check the [updated documentation](http://casperjs.org).

---

2011-12-25, v0.4.2
------------------

- merged PR #30 - Add request method and request data to the `base64encode()` method (@jasonlfunk)
- `casperjs` executable now gracefully exists on KeyboardInterrupt
- added `Casper.download()` method, for downloading any resource and save it onto the filesystem

---

2011-12-21, v0.4.1
------------------

- fixed #31 - replaced bash executable script by a Python one

---

2011-12-20, v0.4.0
------------------

- first numbered version
