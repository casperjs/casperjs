[PhantomJS](http://phantomjs.org/) >= 1.3 must be installed. Check out
[PhantomJS' installation
instructions](http://code.google.com/p/phantomjs/wiki/Installation). Once
PhantomJS's installed on your machine, you should obtain something like this:

    $ phantomjs --version
    1.4.1

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

<span class="label label-info">Note</span> If for some reason you don't have
access to Python, please check this FAQ entry.
