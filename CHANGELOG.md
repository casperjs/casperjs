CasperJS Changelog
==================

XXXX-XX-XX, v0.6.0
------------------

- BC BREAK: `Casper.click()` now uses native phantomjs events instead of previous crazy utopic javascript emulation
- BC BREAK: removed obsolete `replaceFunctionPlaceholders()`
- BC BREAK: deprecated `Casper.extend()` method; use natural javascript extension mechanisms instead (see samples)
- `Casper.open()` can now perform HTTP `GET`, `POST`, `PUT`, `DELETE` and `HEAD` operations
- commonjs/nodejs-like module exports implementation
- ported nodejs' "events" module to casperjs; lots of events added, plus some value filtering capabilities
- introduced the "mouse" module to handle native Webkit mouse events
- added support for RegExp input in `Casper.resourceExists()`

2011-12-25, v0.4.2
------------------

- merged PR #30 - Add request method and request data to the base64encode method (@jasonlfunk)
- casperjs executable now gracefully exists on KeyboardInterrupt
- added Casper.download() method, for downloading any resource and save it onto the filesystem

2011-12-21, v0.4.1
------------------

- fixed #31 - replaced bash executable script by a Python one

---

2011-12-20, v0.4.0
------------------

- first numbered version
