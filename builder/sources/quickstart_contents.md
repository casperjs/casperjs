In the following example, we'll query google for two terms consecutively,
_"capserjs"_ and _"phantomjs"_, aggregate the result links in a standard `Array`
and output the result to the console.

Fire up your favorite editor and save the javascript code below in a
`googlelinks.js` file:

```javascript
var links = [];
var casper = require('casper').create();

function getLinks() {
    var links = document.querySelectorAll('h3.r a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href')
    });
}

casper.start('http://google.fr/', function() {
    // search for 'casperjs' from google form
    this.fill('form[action="/search"]', { q: 'casperjs' }, true);
});

casper.then(function() {
    // aggregate results for the 'casperjs' search
    links = this.evaluate(getLinks);
    // now search for 'phantomjs' by filling the form again
    this.fill('form[action="/search"]', { q: 'phantomjs' }, true);
});

casper.then(function() {
    // aggregate results for the 'phantomjs' search
    links = links.concat(this.evaluate(getLinks));
});

casper.run(function() {
    // echo results in some pretty fashion
    this.echo(links.length + ' links found:');
    this.echo(' - ' + links.join('\n - ')).exit();
});
```

Run it:

```
$ casperjs googlelinks.js
20 links found:
 - https://github.com/n1k0/casperjs
 - https://github.com/n1k0/casperjs/issues/2
 - https://github.com/n1k0/casperjs/tree/master/samples
 - https://github.com/n1k0/casperjs/commits/master/
 - http://www.facebook.com/people/Casper-Js/100000337260665
 - http://www.facebook.com/public/Casper-Js
 - http://hashtags.org/tag/CasperJS/
 - http://www.zerotohundred.com/newforums/members/casper-js.html
 - http://www.yellowpages.com/casper-wy/j-s-enterprises
 - http://local.trib.com/casper+wy/j+s+chinese+restaurant.zq.html
 - http://www.phantomjs.org/
 - http://code.google.com/p/phantomjs/
 - http://code.google.com/p/phantomjs/wiki/QuickStart
 - http://svay.com/blog/index/post/2011/08/31/Paris-JS-10-%3A-Introduction-%C3%A0-PhantomJS
 - https://github.com/ariya/phantomjs
 - http://dailyjs.com/2011/01/28/phantoms/
 - http://css.dzone.com/articles/phantom-js-alternative
 - http://pilvee.com/blog/tag/phantom-js/
 - http://ariya.blogspot.com/2011/01/phantomjs-minimalistic-headless-webkit.html
 - http://www.readwriteweb.com/hack/2011/03/phantomjs-the-power-of-webkit.php
```

### CoffeeScript

You can also write Casper scripts using the [CoffeeScript
syntax](http://jashkenas.github.com/coffee-script/):

```coffeescript
getLinks = ->
  links = document.querySelectorAll "h3.r a"
  Array::map.call links, (e) -> e.getAttribute "href"

links = []
casper = require('casper').create()

casper.start "http://google.fr/", ->
  # search for 'casperjs' from google form
  @fill "form[action="/search"]", q: "casperjs", true

casper.then ->
  # aggregate results for the 'casperjs' search
  links = @evaluate getLinks
  # search for 'phantomjs' from google form
  @fill "form[action="/search"]", q: "phantomjs", true

casper.then ->
  # concat results for the 'phantomjs' search
  links = links.concat @evaluate(getLinks)

casper.run ->
  # display results
  @echo links.length + " links found:"
  @echo(" - " + links.join("\n - ")).exit()
```

Just remember to suffix your script with the `.coffee`extension.
