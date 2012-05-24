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
var casper = new require('casper').create({
    verbose: true
}), terms = casper.cli.args, scores = [], i = 0;

casper.fetchScore = function() {
    return this.evaluate(function() {
        var result = document.querySelector('#resultStats').innerText;
        return parseInt(/Environ ([0-9\s]{1,}).*/.exec(result)[1].replace(/\s/g, ''));
    });
};

if (terms.length < 2) {
    casper
        .echo('Usage: casperjs googlematch.js term1, term2 [, term3]...')
        .exit(1)
    ;
}

casper.echo('Let the match begin!');

casper.start("http://google.fr/");

casper.each(terms, function(self, term, i) {
    self.then(function(self) {
        self.fill('form[action="/search"]', { q: term }, true);
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
    var winner = scores[0];
    for (var i = 0, len = scores.length; i < len; i++)
      if (scores[i].score > winner.score)
        winner = scores[i];
    self.echo('winner is "' + winner.term + '" with ' + winner.score + ' results');
    self.exit();
});
