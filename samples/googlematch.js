/*
Takes provided terms passed as arguments and query google for the number of
estimated results each have.

Usage:
    $ casperjs googlematch.js nicolas chuck borris
    nicolas: 69600000
    chuck:   49500000
    borris:  2370000
    winner is "nicolas" with 69600000 results
*/

var casper = require('casper').create({
    verbose: true
});

casper.fetchScore = function() {
    return this.evaluate(function() {
        var result = document.querySelector('#resultStats').innerText;
        return ~~(/Environ ([0-9\s]{1,}).*/.exec(result)[1].replace(/\s/g, ''));
    });
};

var terms = casper.cli.args;

if (terms.length < 2) {
    casper
        .echo("Usage: $ casperjs googlematch.js term1 term2 [term3]...")
        .exit(1)
    ;
}

var scores = [];

casper.echo("Let the match begin between \"" + (terms.join('", "')) + "\"!");

casper.start("http://google.fr/");

casper.each(terms, function(self, term) {
    this.then(function() {
        this.fill('form[action="/search"]', {
            q: term
        }, true);
    });
    this.then(function() {
        var score;
        score = this.fetchScore();
        scores.push({
            term: term,
            score: score
        });
        self.echo("" + term + ": " + score);
    });
});

casper.run(function() {
    scores.sort(function(a, b) {
        return b.score - a.score;
    });
    var winner = scores[0];
    this.echo("Winner is \"" + winner.term + "\" with " + winner.score + " results");
    this.exit();
});
