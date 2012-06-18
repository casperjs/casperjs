CasperJS Documentation
======================

CasperJS's documentation is hosted on Github thanks to the [Github Pages Feature](http://pages.github.com/).

The documentation sources are in [Markdown format](http://daringfireball.net/projects/markdown/)
and can be found in the [`docs/builder/sources/`](https://github.com/n1k0/casperjs/tree/gh-pages/builder/sources)
directory.

## Contributing to the docs

The same process as usual applies for contributions on Github:

1. fork
2. modify
3. pull request

As the documents are stored in a git submodule, it's a bit more complicated to contribute to them though:

    $ git clone --recursive git@github.com:YOURFORK/casperjs.git
    $ cd casperjs/docs/
    $ git checkout gh-pages
    # make your changes to the doc, then build it (see below)
    # commit your changes, BUT MAKE SURE YOU'RE STILL IN THE **docs** FOLDER OR SUBFOLDER
    $ git commit -m "documented the foobar feature"
    $ git push git@github.com:YOURFORK/casperjs.git gh-pages
    $ cd ../ # BACK TO THE CASPERJS FOLDER
    $ git commit docs -m "updated doc link"
    $ git push

After that, thanks for creating a pull request with your changes, in both branches (on master AND on gh-pages).

If you had already forked and cloned the repository, proceed replace the *git clone* step by the following:

    $ cd casperjs
    $ git submodule update --init
    $ cd docs
    $ git checkout gh-pages
    # make your changes...

## Building the docs

So you may wonder how to generate the documentation HTML page from the source *.md* files? Here you go:

**Hint:** of course you must have [casperjs installed](http://casperjs.org/#installation).

This is what you should see printed to the console when building the docs:

    $ cd docs/builder
    $ ./build
    written /Users/you/Sites/casperjs/docs/index.html
    written /Users/you/Sites/casperjs/docs/installation.html
    written /Users/you/Sites/casperjs/docs/quickstart.html
    written /Users/you/Sites/casperjs/docs/api.html
    written /Users/you/Sites/casperjs/docs/cli.html
    written /Users/you/Sites/casperjs/docs/selectors.html
    written /Users/you/Sites/casperjs/docs/events-filters.html
    written /Users/you/Sites/casperjs/docs/logging.html
    written /Users/you/Sites/casperjs/docs/extending.html
    written /Users/you/Sites/casperjs/docs/testing.html
    written /Users/you/Sites/casperjs/docs/debugging.html
    written /Users/you/Sites/casperjs/docs/faq.html
