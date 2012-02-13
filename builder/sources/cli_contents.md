CasperJS ships with a builting command line parser on top of PhantomJS'
one, located in the `cli` module; it exposes passed arguments as
**positional ones** and **named options**

But no worries for manipulating the `cli` module parsing API, a `Casper`
instance always contains a rady to use `cli` property, allowing easy
access of all these parameters.

Let's consider this simple casper script:

```javascript
var casper = require("casper").create();

casper.echo("Casper CLI passed args:");
require("utils").dump(casper.cli.args);

casper.echo("Casper CLI passed options:");
require("utils").dump(casper.cli.options);

casper.exit();
```

<span class="label label-info">Note</span> Please note the two `casper-path`
and `cli` options; these are passed to the casper script through the `casperjs`
Python executable.

Execution results:

```
$ casperjs test.js arg1 arg2 arg3 --foo=bar --plop anotherarg
Casper CLI passed args: [
    "arg1",
    "arg2",
    "arg3",
    "anotherarg"
]
Casper CLI passed options: {
    "casper-path": "/Users/niko/Sites/casperjs",
    "cli": true,
    "foo": "bar",
    "plop": true
}
```

Getting, checking or dropping parameters:

```javascript
var casper = require("casper").create();
casper.echo(casper.cli.has(0));
casper.echo(casper.cli.get(0));
casper.echo(casper.cli.has(3));
casper.echo(casper.cli.get(3));
casper.echo(casper.cli.has("foo"));
casper.echo(casper.cli.get("foo"));
casper.cli.drop("foo");
casper.echo(casper.cli.has("foo"));
casper.echo(casper.cli.get("foo"));
casper.exit();
```

Execution results:

```
$ casperjs test.js arg1 arg2 arg3 --foo=bar --plop anotherarg
true
arg1
true
anotherarg
true
bar
false
undefined
```

Last but not least, you can still use all PhantomJS standard CLI options
as you would do with any other phantomjs script. To remeber what they
are, just run the `casperjs --help` command:

```
$ casperjs --help
CasperJS version {{version}} at /Users/niko/Sites/casperjs, using PhantomJS version 1.3.0

Usage: casperjs [options] script.[js|coffee] [script argument [script argument ...]]
       casperjs [options] test [test path [test path ...]]

Options:

--cookies-file=/path/to/cookies.txt    Sets the file name to store the persistent cookies
--config=/path/to/config               Specifies path to a JSON-formatted config file
--disk-cache=[yes|no]                  Enables disk cache (at desktop services cache storage location, default is 'no')
--ignore-ssl-errors=[yes|no]           Ignores SSL errors (i.e. expired or self-signed certificate errors)
--load-images=[yes|no]                 Loads all inlined images (default is 'yes')
--load-plugins=[yes|no]                Loads all plugins (i.e. 'Flash', 'Silverlight', ...) (default is 'no')
--local-to-remote-url-access=[yes|no]  Local content can access remote URL (default is 'no')
--max-disk-cache-size=size             Limits the size of disk cache (in KB)
--output-encoding                      Sets the encoding used for terminal output (default is 'utf8')
--proxy=address:port                   Sets the network proxy (e.g. "--proxy=192.168.1.42:8080")
--script-encoding                      Sets the encoding used for the starting script (default is 'utf8')
--version                              Prints out CasperJS version
```