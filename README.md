CasperJS Documentation
======================

CasperJS's documentation is hosted on Github thanks to the [Github Pages Feature](http://pages.github.com/).

The documentation sources are in [Markdown format](http://daringfireball.net/projects/markdown/)
and can be found in the `docs/builder/sources/` directory.

Contributing to the docs
~~~~~~~~~~~~~~~~~~~~~~~~

The same process as usual applies for contributions on Github:
1. fork
2. modify
3. pull request

As the documents are stored in a submodule, it's a bit more complicated to contribute to them though:

    git clone --recursive git@github.com:YOURFORK/casperjs.git
    cd casperjs/docs/
    git checkout gh-pages
    # make your changes to the doc, then build it (see below)
    # commit your changes, BUT MAKE SURE YOU'RE STILL IN THE **docs** FOLDER OR SUBFOLDER
    git commit -m "documented the foobar feature"
    git push git@github.com:YOURFORK/casperjs.git gh-pages
    cd ../ # BACK TO THE CASPERJS FOLDER
    git commit docs -m "updated doc link"
    git push

After that, thanks for creating a pull request with your changes, in both branches (on master AND on gh-pages).

If you had already forked and cloned the repository, proceed replace the *git clone* step by the following:

    cd casperjs
    git submodule update --init
    cd docs
    git checkout gh-pages
    # make your changes...


Building the docs
~~~~~~~~~~~~~~~~~

So you may wonder how to generate the documentation HTML page from the source *.md* files? Here
you go:

**Hint:** of course you must have [casperjs installed](http://casperjs.org/#installation).

This is what you should see quite beautifully printed to the console when building the docs:

    $ ./build
    Selector "#about": converting source sources/about.html
    Included sources/about.html
    Selector "#installation_contents": converting source sources/installation_contents.md
    Converted sources/installation_contents.md
    Selector "#quickstart_contents": converting source sources/quickstart_contents.md
    Converted sources/quickstart_contents.md
    Selector "#apidoc_contents": converting source sources/apidoc_contents.md
    Converted sources/apidoc_contents.md
    Selector "#apidoc_toc": converting source sources/apidoc_toc.md
    Converted sources/apidoc_toc.md
    Selector "#cli_contents": converting source sources/cli_contents.md
    Converted sources/cli_contents.md
    Selector "#filters_contents": converting source sources/filters_contents.md
    Converted sources/filters_contents.md
    Selector "#clientutils_contents": converting source sources/clientutils_contents.md
    Converted sources/clientutils_contents.md
    Selector "#clientutils_toc": converting source sources/clientutils_toc.md
    Converted sources/clientutils_toc.md
    Selector "#tester_contents": converting source sources/tester_contents.md
    Converted sources/tester_contents.md
    Selector "#tester_toc": converting source sources/tester_toc.md
    Converted sources/tester_toc.md
    Selector "#colorizer_contents": converting source sources/colorizer_contents.md
    Converted sources/colorizer_contents.md
    Selector "#colorizer_toc": converting source sources/colorizer_toc.md
    Converted sources/colorizer_toc.md
    Selector "#logging_contents": converting source sources/logging_contents.md
    Converted sources/logging_contents.md
    Selector "#extending_contents": converting source sources/extending_contents.md
    Converted sources/extending_contents.md
    Selector "#testing_contents": converting source sources/testing_contents.md
    Converted sources/testing_contents.md
    Selector "#faq_contents": converting source sources/faq_contents.md
    Converted sources/faq_contents.md
    Selector "#faq_toc": converting source sources/faq_toc.md
    Converted sources/faq_toc.md
    Selector "#download_contents": converting source sources/download_contents.md
    Converted sources/download_contents.md
    Selector "#license_contents": converting source sources/license_contents.md
    Converted sources/license_contents.md
    Opening template: file:///Users/niko/Sites/casperjs/docs/builder/template.html
    Saving to ../index.html
    Saved to ../index.html
    All done.
