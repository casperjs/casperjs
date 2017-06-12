/*eslint strict:0*/
var r = require('casper').selectRegex;

casper.test.begin('Regex tests', 6, function(test) {
    casper.start('tests/site/index.html', function() {
        test.assertExists({
            type:       'regex',
            tag:        'img',
            attributes: {'src': 'png$'}
        }, 'regex selector can find an element');
        test.assertDoesntExist({
            type:       'regex',
            tag:        'img',
            attributes: {'src': 'false$'}
        }, 'regex selector doesn not retrieve a nonexistent element');
        test.assertExists(r('img', {'src': 'png$'}), 'selectRegex() shortcut can find an element as well');
        test.assertEvalEquals(function() {
            return __utils__.findAll({type: 'regex', tag:'a', attributes: {'href':'html$'}}).length;
        }, 2, 'Correct number of elements are found');
    });

    casper.thenClick(r('a', {'href': 'form'}), function() {
        test.assertTitle('CasperJS test form', 'Clicking Regex works as expected');
        this.fill(r('form', {'action': '^result'}), {
            email: 'chuck@norris.com'
        });
        test.assertEvalEquals(function() {
            return document.querySelector('input[name="email"]').value;
        }, 'chuck@norris.com', 'Casper.fill() can fill an input[type=text] form field');
    });

    casper.run(function() {
        test.done();
    });
});
