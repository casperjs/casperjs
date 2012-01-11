var fs = require('fs');
var clientutils = require('clientutils').create();
var testCases = {
    'an empty string': '',
    'a word':          'plop',
    'a null char':     'a\u0000',
    'an utf8 string':  'ÀÁÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ',
    'song lyrics':     ("Voilà l'été, j'aperçois le soleil\n" +
                        "Les nuages filent et le ciel s'éclaircit\n" +
                        "Et dans ma tête qui bourdonnent?\n" +
                        "Les abeilles!"),
    'a file contents': fs.read(phantom.casperPath + '/tests/site/alert.html')
};

casper.test.comment('ClientUtils.encode()');

for (var what in testCases) {
    var source = testCases[what];
    var encoded = clientutils.encode(source);
    casper.test.assertEquals(clientutils.decode(encoded), source, 'ClientUtils can encode and decode ' + what);
}

casper.test.done();
