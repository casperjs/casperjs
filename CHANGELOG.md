CasperJS Changelog
==================

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
