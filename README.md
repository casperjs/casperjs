# Casper.js

Casper is a navigation utility for [PhantomJS](http://www.phantomjs.org/).

More documentation to come soon, I swear. If you just can't wait, here's a sample script:

    phantom.injectJs('casper.js');

    // User defined functions
    function q() {
        document.querySelector('input[name="q"]').setAttribute('value', '%term%');
        document.querySelector('form[name="f"]').submit();
    }

    function getLinks() {
        return Array.prototype.map.call(document.querySelectorAll('h3.r a'), function(e) {
            return e.getAttribute('href');
        });
    }

    // Casper suite
    var links = [];
    var casper = new phantom.Casper()
        .start('http://google.fr/')
        .thenEvaluate(q, {
            term: 'casper',
        })
        .then(function(self) {
            links = self.evaluate(getLinks);
        })
        .thenEvaluate(q, {
            term: 'homer',
        })
        .then(function(self) {
            links = links.concat(self.evaluate(getLinks));
        })
        .run(function(self) {
            self.echo(JSON.stringify({
                result: self.result,
                links: links
            }, null, '  '));
            self.exit();
        })
    ;

Run it:

    $ phantomjs example.js
    {
      "result": {
        "log": [
          {
            "level": "info",
            "space": "phantom",
            "message": "Starting…",
            "date": "Mon Sep 05 2011 16:10:56 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Running suite: 4 steps",
            "date": "Mon Sep 05 2011 16:10:56 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 1/4: http://www.google.fr/ (HTTP 301)",
            "date": "Mon Sep 05 2011 16:10:57 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 1/4: done in 1259ms.",
            "date": "Mon Sep 05 2011 16:10:57 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 2/4: http://www.google.fr/search?sclient=psy&hl=fr&site=&source=hp&q=casper&pbx=1&oq=&aq=&aqi=&aql=&gs_sm=&gs_upl= (HTTP 301)",
            "date": "Mon Sep 05 2011 16:10:58 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 2/4: done in 2145ms.",
            "date": "Mon Sep 05 2011 16:10:58 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 3/4: http://www.google.fr/search?sclient=psy&hl=fr&site=&source=hp&q=casper&pbx=1&oq=&aq=&aqi=&aql=&gs_sm=&gs_upl= (HTTP 301)",
            "date": "Mon Sep 05 2011 16:10:58 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 3/4: done in 2390ms.",
            "date": "Mon Sep 05 2011 16:10:58 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 4/4: http://www.google.fr/search?sclient=psy&hl=fr&source=hp&q=homer&pbx=1&oq=&aq=&aqi=&aql=&gs_sm=&gs_upl= (HTTP 301)",
            "date": "Mon Sep 05 2011 16:10:59 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Step 4/4: done in 3077ms.",
            "date": "Mon Sep 05 2011 16:10:59 GMT+0200 (CEST)"
          },
          {
            "level": "info",
            "space": "phantom",
            "message": "Done 4 steps in 3077ms.",
            "date": "Mon Sep 05 2011 16:10:59 GMT+0200 (CEST)"
          }
        ],
        "status": "success",
        "time": 3077
      },
      "links": [
        "http://fr.wikipedia.org/wiki/Casper_le_gentil_fant%C3%B4me",
        "http://fr.wikipedia.org/wiki/Casper",
        "http://casperflights.com/",
        "http://www.allocine.fr/film/fichefilm_gen_cfilm=13018.html",
        "/search?q=casper&hl=fr&prmd=ivns&tbm=isch&tbo=u&source=univ&sa=X&ei=cdhkTurpFa364QTB5uGeCg&ved=0CFkQsAQ",
        "http://www.youtube.com/watch?v=Kuvo0QMiNEE",
        "http://www.youtube.com/watch?v=W7cW5YlHaeQ",
        "http://www.imdb.com/title/tt0112642/",
        "http://blog.caspie.net/",
        "http://www.casperwy.gov/",
        "http://www.lequipe.fr/Cyclisme/CyclismeFicheCoureur147.html",
        "http://homer-simpson-tv.blog4ever.com/",
        "http://fr.wikipedia.org/wiki/Homer_Simpson",
        "http://en.wikipedia.org/wiki/Homer",
        "/search?q=homer&hl=fr&prmd=ivnsb&tbm=isch&tbo=u&source=univ&sa=X&ei=cthkTr73Hefh4QSUmt3UCg&ved=0CEQQsAQ",
        "http://www.youtube.com/watch?v=Ajd08hgerRo",
        "http://www.koreus.com/video/homer-simpson-photo-39-ans.html",
        "http://www.nrel.gov/homer/",
        "http://www.luds.net/homer.php",
        "http://www.thesimpsons.com/bios/bios_family_homer.htm",
        "http://www.homeralaska.org/",
        "http://homeralaska.com/"
      ]
}

## Now what

Feel free to play with the code and report an issue on github. I'm also reachable [on twitter](https://twitter.com/n1k0).
