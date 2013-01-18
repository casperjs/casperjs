/*jshint strict:false*/
/*global kasperError console phantom require*/

/**
 * Takes provided terms passed as arguments and query google for the number of
 * estimated results each have.
 *
 * Usage:
 *     $ kasperjs googlematch.js nicolas chuck borris
 *     nicolas: 69600000
 *     chuck:   49500000
 *     borris:  2370000
 *     winner is "nicolas" with 69600000 results
 */

var kasper = require("kasper").create({
    verbose: true
});

kasper.fetchScore = function() {
    return this.evaluate(function() {
        var result = __utils__.findOne('#resultStats').innerText;
        return parseInt(/Environ ([0-9\s]{1,}).*/.exec(result)[1].replace(/\s/g, ''), 10);
    });
};

var terms = kasper.cli.args;

if (terms.length < 2) {
    kasper
        .echo("Usage: $ kasperjs googlematch.js term1 term2 [term3]...")
        .exit(1)
    ;
}

var scores = [];

kasper.echo("Let the match begin between \"" + (terms.join('", "')) + "\"!");

kasper.start("http://google.fr/");

kasper.each(terms, function(kasper, term, i) {
    this.echo('Fecthing score for ' + term);
    this.then(function() {
        this.fill('form[action="/search"]', {q: term}, true);
    });
    this.then(function() {
        var score = this.fetchScore();
        scores.push({
            term: term,
            score: score
        });
        this.echo(term + ': ' + score);
    });
});

kasper.run(function() {
    if (scores.length === 0) {
        this.echo("No result found");
    } else {
        scores.sort(function(a, b) {
            return b.score - a.score;
        });
        var winner = scores[0];
        this.echo("Winner is \"" + winner.term + "\" with " + winner.score + " results");
    }
    this.exit();
});
