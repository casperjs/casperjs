**[PhantomJS](http://phantomjs.org/) >= 1.5 must be installed on your system**.
Check out [PhantomJS' installation instructions](http://code.google.com/p/phantomjs/wiki/Installation),
and:

* Ensure to always install the **latest stable version of PhantomJS**;

* <span class="label label-warning">Ubuntu users</span> Double check the
  version of PhantomJS provided by your apt repository, if any. Often, only old
  versions are provided.

* <span class="label label-info">OSX users</span> If you use
  [Homebrew](http://mxcl.github.com/homebrew/), you can install both CasperJS
  and PhantomJS using this command:

      $ brew install casperjs

Installation can be achieved using [git](http://git-scm.com/):

    $ git clone git://github.com/n1k0/casperjs.git
    $ cd casperjs
    $ git checkout tags/{{version}}
    $ ln -sf `pwd`/bin/casperjs /usr/local/bin/casperjs

Once PhantomJS and CasperJS installed on your machine, you should obtain
something like this:

    $ phantomjs --version
    1.5.0
    $ casperjs --version
    {{version}}

You are now ready to write your [first script](quickstart.html)!

<span class="label label-info">Note</span> The casperjs executable is written
in [Python](http://python.org/), so you can also run it using the python
command:

    $ python /path/to/casperjs/bin/casperjs
    CasperJS version {{version}} at /Users/niko/casperjs
    Usage: casperjs script.(js|coffee) [options...]
    Read the docs http://casperjs.org/

<span class="label label-info">Note</span> If for any reason you **don't have
access to Python** or are **running Windows**, please check this
<a href="faq.html#faq-executable">FAQ entry</a>.

## Contribute!

Feel free to play with the code and [report any issue on
github](https://github.com/n1k0/casperjs/issues). CasperJS has also its own [on
twitter account](https://twitter.com/casperjs_org).
