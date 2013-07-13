# CasperJS

>**Important note:** the `master` branch hosts the development version of CasperJS, which is now pretty stable and should be the right version to use if you ask me.
>
>Use the [`1.0` branch](https://github.com/n1k0/casperjs/tree/1.0) if you want to keep in sync with the stable old version, or [use tagged versions](https://github.com/n1k0/casperjs/tags).
>
>Currently, available documentation is:
>
>- **hosted on [docs.casperjs.org](http://docs.casperjs.org/) for the development branch**
>- hosted on [casperjs.org](http://casperjs.org/) for the 1.0 branch
>
>[Travis-CI](http://travis-ci.org/n1k0/casperjs) build status:
>
>- ![Build Status](https://travis-ci.org/n1k0/casperjs.png?branch=master) `master` branch
>- 1.0 tests unfortunately have to be run manually using the `casperjs selftest` command

CasperJS is a navigation scripting & testing utility for [PhantomJS](http://www.phantomjs.org/)
and [SlimerJS](http://slimerjs.org/). It eases the process of defining a full navigation
scenario and provides useful high-level functions, methods & syntaxic sugar for doing common
tasks such as:

- defining & ordering [navigation steps](http://casperjs.org/quickstart.html)
- [filling forms](http://casperjs.org/api.html#casper.fill)
- [clicking links](http://casperjs.org/api.html#casper.click)
- [capturing screenshots](http://casperjs.org/api.html#casper.captureSelector) of a page (or an area)
- [making assertions on remote DOM](http://casperjs.org/api.html#tester)
- [logging](http://casperjs.org/logging.html) & [events](http://casperjs.org/events-filters.html)
- [downloading base64](http://casperjs.org/api.html#casper.download) encoded resources, even binary ones
- catching errors and react accordingly
- writing [functional test suites](http://casperjs.org/testing.html), exporting results as JUnit XML (xUnit)

Browse the [sample examples repository](https://github.com/n1k0/casperjs/tree/master/samples).
Don't hesitate to pull request for any cool example of yours as well!

**Read the [full documentation](http://casperjs.org/) on casperjs dedicated website.**

Subscribe to the [project mailing-list](https://groups.google.com/forum/#!forum/casperjs)

Follow the CasperJS project [on twitter](https://twitter.com/casperjs_org) and [Google+](https://plus.google.com/b/106641872690063476159/).

## Show me some code!

Sample test to see if some dropdown can be opened:

```javascript
casper.test.begin('a twitter bootsrap dropdown can be opened', 2, function(test) {
    casper.start('http://twitter.github.com/bootstrap/javascript.html#dropdowns', function() {
        test.assertExists('#navbar-example');
        this.click('#dropdowns .nav-pills .dropdown:last-of-type a.dropdown-toggle');
        this.waitUntilVisible('#dropdowns .nav-pills .open', function() {
            test.pass('Dropdown is open');
        });
    }).run(function() {
        test.done();
    });
});
```

Run the script:

![](http://cl.ly/image/271e2i403A0F/Capture%20d%E2%80%99%C3%A9cran%202013-01-20%20%C3%A0%2009.26.15.png)

##Support

If you're having problems with using the project, use the support forum at CodersClan.

<a href="http://codersclan.net/forum/index.php?repo_id=32"><img src="http://www.codersclan.net/graphics/getSupport_blue_big.png" width="160"></a>

## Contributing

### Contributing code

Please read the [CONTRIBUTING.md](https://github.com/n1k0/casperjs/blob/master/CONTRIBUTING.md) file contents.

### Contributing documentation

CasperJS's documentation is written using the [Markdown format](http://daringfireball.net/projects/markdown/), and hosted on Github thanks to the [Github Pages Feature](http://pages.github.com/).

To view the source files on github, head to [the gh-pages branch](https://github.com/n1k0/casperjs/tree/gh-pages), and check the [documentation's README](https://github.com/n1k0/casperjs/tree/gh-pages#readme) for further instructions.
