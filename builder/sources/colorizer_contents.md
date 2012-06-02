Casper ships with a `colorizer` module which contains a `Colorizer`
class which can print stuff to the console output in color:

```javascript
var colorizer = require('colorizer').create();
console.log(colorizer.colorize("Hello World", "INFO"));
```

Though most of the times you will use it transparently using the
[`Casper.echo()`](api.html#echo) method:

```javascript
casper.echo('an informative message', 'INFO'); // printed in green
casper.echo('an error message', 'ERROR');      // printed in red
```

### Available predefined styles

Available predefined styles are:

- `ERROR`: white text on red background
- `INFO`: green text
- `TRACE`: green text
- `PARAMETER`: cyan text
- `COMMENT`: yellow text
- `WARNING`: red text
- `GREEN_BAR`: green text on white background
- `RED_BAR`: white text on red background
- `INFO_BAR`: cyan text

Here's a sample output of what it can look like:

![capture](images/colorizer.png)

<h3 id="colorize"><code>Colorizer#colorize(String text, String styleName)</code></h3>

Computes a colored version of the provided text string using a given
predefined style.

```javascript
var colorizer = require('colorizer').create();
console.log(colorizer.colorize("I'm a red error", "ERROR"));
```

<span class="label label-info">Note</span> Most of the time you won't have to
use a `Colorizer` instance directly as CasperJS provides all the necessary
methods.

See the list of the [predefined styles available](#predefined-styles).

<h3 id="format"><code>Colorizer#format(String text, Object style)</code></h3>

Formats a text string using the provided style definition. A style
definition is a standard javascript `Object` instance which can define
the following properties:

- String `bg`: background color name
- String `fg`: foreground color name
- Boolean `bold`: apply bold formatting
- Boolean `underscore`: apply underline formatting
- Boolean `blink`: apply blink formatting
- Boolean `reverse`: apply reverse formatting
- Boolean `conceal`: apply conceal formatting

<span class="label label-info">Note</span> Available color names are `black`,
`red`, `green`, `yellow`, `blue`, `magenta`, `cyan` and `white`.

```javascript
var colorizer = require('colorizer').create();
colorizer.format("We all live in a yellow submarine", {
    bg:   'yellow',
    fg:   'blue',
    bold: true
});
```
