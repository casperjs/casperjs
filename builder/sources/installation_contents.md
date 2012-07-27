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

```
$ git clone git://github.com/n1k0/casperjs.git
$ cd casperjs
$ git checkout tags/{{version}}
$ ln -sf `pwd`/bin/casperjs /usr/local/bin/casperjs
```

Once PhantomJS and CasperJS installed on your machine, you should obtain
something like this:

```
$ phantomjs --version
1.5.0
$ casperjs --version
{{version}}
```

You are now ready to write your [first script](quickstart.html)!

<span class="label label-info">Note</span>
The `casperjs` executable is written in [Python](http://python.org/), so please ensure
that a Python interpreter is available on your platform.

## Ruby version

<span class="label label-success">Added in 1.0</span>
A [Ruby](http://ruby-lang.org/) version of the `casperjs` executable is also
available in the `bin/` directory; in order to use the ruby version instead
of the python one:

```
$ ln -sf `pwd`/bin/casperjs_ruby /usr/local/bin/casperjs
```

Or using the ruby interpreter:

```
$ ruby /path/to/casperjs/bin/casperjs_ruby
CasperJS version {{version}} at /Users/niko/Sites/casperjs, using PhantomJS version 1.6.0
...
```

## Help! I don't have Python nor Ruby (Hi, Windows user)

**If you're on Windows**, this is the way you may manage to get casper working
the most easily:

```javascript
phantom.casperPath = 'C:\\path\\to\\your\\repo\\lib\\casperjs-{{version}}';
phantom.injectJs(phantom.casperPath + '\\bin\\bootstrap.js');

var casper = require('casper').create();

// do stuff
```

Then just run your script using the `phantom.exe` program.

<span class="label label-info">Note</span>
There is no output coloration when running CasperJS on Microsoft platforms.

## Contribute!

Feel free to play with the code and [report any issue on
github](https://github.com/n1k0/casperjs/issues). CasperJS has also its own [on
twitter account](https://twitter.com/casperjs_org).
