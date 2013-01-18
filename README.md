# kasperJS [![Build Status](https://secure.travis-ci.org/n1k0/kasperjs.png)](http://travis-ci.org/n1k0/kasperjs)

kasperJS is a navigation scripting & testing utility for [PhantomJS](http://www.phantomjs.org/).
It eases the process of defining a full navigation scenario and provides useful
high-level functions, methods & syntaxic sugar for doing common tasks such as:

- defining & ordering [navigation steps](http://kasperjs.org/quickstart.html)
- [filling forms](http://kasperjs.org/api.html#kasper.fill)
- [clicking links](http://kasperjs.org/api.html#kasper.click)
- [capturing screenshots](http://kasperjs.org/api.html#kasper.captureSelector) of a page (or an area)
- [making assertions on remote DOM](http://kasperjs.org/api.html#tester)
- [logging](http://kasperjs.org/logging.html) & [events](http://kasperjs.org/events-filters.html)
- [downloading base64](http://kasperjs.org/api.html#kasper.download) encoded resources, even binary ones
- catching errors and react accordingly
- writing [functional test suites](http://kasperjs.org/testing.html), exporting results as JUnit XML (xUnit)

Browse the [sample examples repository](https://github.com/n1k0/kasperjs/tree/master/samples).
Don't hesitate to pull request for any cool example of yours as well!

**Read the [full documentation](http://kasperjs.org/) on kasperjs dedicated website.**

Subscribe to the [project mailing-list](https://groups.google.com/forum/#!forum/kasperjs)

Follow the kasperJS project [on twitter](https://twitter.com/kasperjs_org) and [Google+](https://plus.google.com/b/106641872690063476159/).

## Show me some code!

Sample test to see if some dropdown can be opened:

```javascript
kasper.start('http://twitter.github.com/bootstrap/javascript.html#dropdowns', function() {
    this.test.assertExists('#navbar-example');
    this.click('#dropdowns .nav-pills .dropdown:last-of-type a.dropdown-toggle');
    this.waitUntilVisible('#dropdowns .nav-pills .open', function() {
        this.test.pass('Dropdown is open');
    });
});

kasper.run(function() {
    this.test.done();
});
```

Run the script:

![](http://cl.ly/image/112m0F2n162i/Capture%20d%E2%80%99%C3%A9cran%202012-10-19%20%C3%A0%2016.37.15.png)

## Contributing

### Contributing code

Please read the [CONTRIBUTING.md](https://github.com/n1k0/kasperjs/blob/master/CONTRIBUTING.md) file contents.

### Contributing documentation

kasperJS's documentation is written using the [Markdown format](http://daringfireball.net/projects/markdown/), and hosted on Github thanks to the [Github Pages Feature](http://pages.github.com/).

To view the source files on github, head to [the gh-pages branch](https://github.com/n1k0/kasperjs/tree/gh-pages), and check the [documentation's README](https://github.com/n1k0/kasperjs/tree/gh-pages#readme) for further instructions.
