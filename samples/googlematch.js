/**
 * Takes provided terms passed as arguments and query google for the number of
 * estimated results each have.
 *
 * Usage:
 *   $ casperjs samples/googlematch.js nicolas chuck borris
 *   nicolas: 69600000
 *   chuck:   49500000
 *   borris:  2370000
 *   winner is "nicolas" with 69600000 results
 */

if (!phantom.casperLoaded) {
    console.log('This script is intended to work with CasperJS, using its executable.');
    phantom.exit(1);
}

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
}), terms = casper.cli.args, scores = [], i = 0;

if (terms.length < 2) {
    casper.echo('Usage: casperjs googlematch.js term1, term2 [, term3]...').exit();
}

casper.echo('Let the match begin!');

casper.start("http://google.fr/");

casper.each(terms, function(self, term, i) {
    self.then(function(self) {
        self.fill('form[name=f]', { q: term }, true);
    }).then(function(self) {
        var score = self.fetchScore();
        scores.push({
            term:  term,
            score: score
        });
        self.echo(term + ': ' + score);
    });
});

casper.run(function(self) {
    scores.sort(function(a, b) {
        return a.score - b.score;
    });
    var winner = scores[scores.length - 1];
    self.echo('winner is "' + winner.term + '" with ' + winner.score + ' results');
    self.exit();
});

