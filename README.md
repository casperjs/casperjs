# CasperJS

[Travis-CI](http://travis-ci.org/casperjs/casperjs) build status: [![Build Status](https://travis-ci.org/casperjs/casperjs.png?branch=master)](https://travis-ci.org/casperjs/casperjs) `master` branch

>**Important note:** the `master` branch hosts the development version of CasperJS, which is now pretty stable and should be the right version to use if you ask me. Users interested in a pretty stable, recent version working with PhantomJS 2.0 and newer should choose the packaged 1.1.0 and following releases.
>
> The [`1.0` branch](https://github.com/casperjs/casperjs/tree/1.0) is now obsolete. Please note that
>- it is only recommended if you need to keep old production tests running that could do with the now **unmaintained PhantomJS 1.9**
>- 1.0 tests unfortunately have to be run manually using the `casperjs selftest` command
> 
> **Note that all versions up to and including 1.1-beta3 do not support PhantomJS 2.0 and newer.**

The complete documentation for the current releases is **hosted on [docs.casperjs.org](http://docs.casperjs.org/).**

CasperJS is a navigation scripting & testing utility for [PhantomJS](http://www.phantomjs.org/)
and [SlimerJS](http://slimerjs.org/) (still experimental).
It eases the process of defining a full navigation
scenario and provides useful high-level functions, methods & syntactic sugar for doing common
tasks such as:

- defining & ordering [navigation steps](http://docs.casperjs.org/en/latest/quickstart.html)
- [filling forms](http://docs.casperjs.org/en/latest/modules/casper.html#fill)
- [clicking links](http://docs.casperjs.org/en/latest/modules/casper.html#click)
- [capturing screenshots](http://docs.casperjs.org/en/latest/modules/casper.html#captureselector) of a page (or an area)
- [making assertions on remote DOM](http://docs.casperjs.org/en/latest/modules/tester.html)
- [logging](http://docs.casperjs.org/en/latest/logging.html) & [events](http://docs.casperjs.org/en/latest/events-filters.html)
- [downloading](http://docs.casperjs.org/en/latest/modules/casper.html#download) resources, even binary ones
- catching errors and react accordingly
- writing [functional test suites](http://docs.casperjs.org/en/latest/testing.html), exporting results as JUnit XML (xUnit)

Browse the [sample examples repository](https://github.com/casperjs/casperjs/tree/master/samples).
Don't hesitate to pull request for any cool example of yours as well!

**Read the [full documentation](http://docs.casperjs.org/) on casperjs documentation website.**

Subscribe to the [project mailing-list](https://groups.google.com/forum/#!forum/casperjs)

Follow the CasperJS project [on twitter](https://twitter.com/casperjs_org) and [Google+](https://plus.google.com/b/106641872690063476159/).

## Show me some code!

First [install CasperJS](http://docs.casperjs.org/en/latest/installation.html), we'll use 1.1 beta here.

Sample test to see if some dropdown can be opened:

```javascript
casper.test.begin('a twitter bootstrap dropdown can be opened', 2, function(test) {
    casper.start('http://getbootstrap.com/2.3.2/javascript.html#dropdowns', function() {
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

**Help request**. If you're stuck using CasperJS and don't understand how to achieve something, please [ask on the mailing-list](https://groups.google.com/forum/#!forum/casperjs) first. If the discussion reveals that you have found a real issue that might need a change within CasperJS, file an issue.

**Filing issues**. It takes a lot of time to review, validate, and de-duplicate filed issues. This time could be spent better on actually improving on CasperJS. Filing an issue might be a helpful contribution, but we expect you to read our [CONTRIBUTING.md](https://github.com/casperjs/casperjs/blob/master/CONTRIBUTING.md) guidelines first. 

**Professional Support**. Need help with getting CasperJS up and running? Got a time-consuming problem you want to get solved quickly?

Try to find someone to address your specific problem and [post a reward at bountysource](https://www.bountysource.com).

If you need to have a known issue resolved and don't have the time or skills to do it on your own, you could [post a reward for any open issue directly](https://www.bountysource.com/teams/casperjs/issues).

## Contributing

### Contributing code

Please read the [CONTRIBUTING.md](https://github.com/casperjs/casperjs/blob/master/CONTRIBUTING.md) file contents.

### Contributing documentation

CasperJS's documentation is written using the [Markdown format](http://daringfireball.net/projects/markdown/), and hosted on Github thanks to the [Github Pages Feature](http://pages.github.com/).

To view the source files on github, head to [the gh-pages branch](https://github.com/casperjs/casperjs/tree/gh-pages), and check the [documentation's README](https://github.com/casperjs/casperjs/tree/gh-pages#readme) for further instructions.

## Team

- Nicolas Perriault ([@n1k0](https://github.com/n1k0))
- Nick Currier ([@hexid](https://github.com/hexid))
- Laurent Jouanneau ([@laurentj](https://github.com/laurentj))
- Mickaël Andrieu ([@mickaelandrieu](https://github.com/mickaelandrieu))
- Matt DuVall ([@mduvall](https://github.com/mduvall))
- Ryan Null ([@BIGjuevos](https://github.com/BIGjuevos))

## License

MIT
