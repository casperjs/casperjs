[PhantomJS](http://phantomjs.org/) >= 1.5 must be installed (1.5.0 highly
recommended). Check out [PhantomJS' installation
instructions](http://code.google.com/p/phantomjs/wiki/Installation), and:

* Ensure to always install the latest available version of PhantomJS, and prefer
  static builds over other package installation methods

* <span class="label label-warning">Ubuntu users</span> Double check the
  version of PhantomJS provided by your apt repository. Often, only old versions
  are provided.

Once PhantomJS's installed on your machine, you should obtain something like this:

    $ phantomjs --version
    1.5.0

Now just follow these instructions:

    $ git clone git://github.com/n1k0/casperjs.git
    $ cd casperjs
    $ git checkout tags/{{version}}
    $ ln -sf `pwd`/bin/casperjs /usr/local/bin/casperjs

So now you should get something like this:

    $ casperjs --version
    {{version}}

You are now ready to write your first script!

<span class="label label-info">Note</span> The casperjs executable is written
in [Python](http://python.org/), so you can also run it using the python command:

    $ python /path/to/casperjs/bin/casperjs
    CasperJS version {{version}} at /Users/niko/casperjs
    Usage: casperjs script.(js|coffee) [options...]
    Read the docs http://casperjs.org/

<span class="label label-info">Note</span> If for any reason you **don't have
access to Python** or are **running Windows**, please check this
<a href="#faq-executable">FAQ entry</a>.

## Alternative way for downloading

You can download this project in either
[zip](https://github.com/n1k0/casperjs/zipball/{{version}}) or
[tar](https://github.com/n1k0/casperjs/tarball/{{version}}) formats. You can
also clone the project with [Git](http://git-scm.com) by running:

```
$ git clone git://github.com/n1k0/casperjs casperjs
```

Always try to use a tagged version on production:

```
$ cd casperjs
$ git checkout tags/{{version}}
```

Feel free to play with the code and [report any issue on
github](https://github.com/n1k0/casperjs/issues). CasperJS has also its own [on
twitter account](https://twitter.com/casperjs_org).
