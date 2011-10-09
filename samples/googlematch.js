/**
 * Takes provided terms passed as arguments and query google for the number of
 * estimated results each have.
 *
 * Usage:
 *   $ phantomjs samples/googlematch.js nicolas chuck borris
 *   nicolas: 69600000
 *   chuck:   49500000
 *   borris:  2370000
 *   winner is "nicolas" with 69600000 results
 */
phantom.injectJs('casper.js');

phantom.Casper.extend({
    fetchScore: function() {
        return this.evaluate(function() {
            var result = document.querySelector('#resultStats').innerText;
            return Number(/Environ ([0-9\s]{1,}).*/.exec(result)[1].replace(/\s/g, ''));
        });
    }
});

var casper = new phantom.Casper({
    verbose: true
}), terms = phantom.args, scores = [], i = 0;

if (terms.length < 2) {
    casper.log('usage: phantomjs googlematch.js term1, term2 [, term3]...').exit();
}

casper.start("http://google.fr/");

casper.repeat(terms.length, function(self) {
    self.then((function(casper, i) {
        return function(self) {
            self.fill('form[name=f]', {
                q: terms[i]
            }, true);
        };
    })(self, i));
    self.then((function(casper, i) {
        return function(self) {
            var term = terms[i], score = self.fetchScore();
            scores.push({
                term:  term,
                score: score
            });
            self.echo(term + ': ' + score);
        };
    })(self, i));
    i++;
});

casper.run(function(self) {
    scores.sort(function(a, b) {
        return a.score - b.score;
    });
    var winner = scores[scores.length - 1];
    self.echo('winner is "' + winner.term + '" with ' + winner.score + ' results')
    self.exit();
});

