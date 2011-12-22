(function(t) {
    t.comment('ClientUtils.encode()');

    var fs = require('fs');
    var utils = new phantom.Casper.ClientUtils();
    var testCases = {
        'an empty string': '',
        'a word':          'plop',
        'an utf8 string':  '<chè!cs!<egfhèqzgrqgzf',
        'song lyrics':     ("Voilà l'été, j'aperçois le soleil\n" +
                            "Les nuages filent et le ciel s'éclaircit\n" +
                            "Et dans ma tête qui bourdonnent?\n" +
                            "Les abeilles!"),
        'a file contents': fs.read(phantom.casperPath + '/tests/site/alert.html')
    };

    for (var what in testCases) {
        var source = testCases[what];
        var encoded = utils.encode(source);
        t.assertEquals(utils.decode(encoded), source, 'ClientUtils can encode and decode ' + what);
    }

    t.done();
})(casper.test);
