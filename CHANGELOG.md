CasperJS Changelog
==================

XXXX-XX-XX, v0.6.2
------------------

- fixes #43 - Exit status not reported back to caller
- closes #42 - Use file name of test script as 'classname' in JUnit XML report (@mpeltonen)
- added `--xunit=<filename>` cli option to `$ casperjs test` command for saving xunit results, eg.:

      $ casperjs test tests/suites --xunit=build-result.xml


2012-01-16, v0.6.1
------------------

- restablished js-emulated click simulation first, then native QtWebKit
  events as a fallback; some real world testing have surprinsingly proven the former being often
  more efficient than the latter
- fixed casperjs executable could not handle a `PHANTOMJS_EXECUTABLE` containing spaces
- fixed casper could not be used without the executable [as documented](http://n1k0.github.com/casperjs/#faq-executable)
- fixed wrong `debug` log level on `ClientUtils.click()` error; set to `error`

Please check the [updated documentation](http://n1k0.github.com/casperjs).

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

Please check the [updated documentation](http://n1k0.github.com/casperjs).

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
