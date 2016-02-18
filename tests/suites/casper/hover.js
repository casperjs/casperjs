/*global casper*/
/*eslint strict:0, max-statements: [1, 99]*/
var utils = require('utils');

casper.test.begin('hover() tests first solution with addCssPseudoClass', 3, function(test) {
    casper.start('tests/site/hover.html').on('remote.message', function(msg){console.log(msg);}
    ).then(function() {
       test.assertNotVisible('#cssPseudoRight','Casper.() is not visible because of css :hover class is disable');
    }).then(function() {
       this.addPseudoClass('hover','#cssPseudo');
       test.assertVisible('#cssPseudoRight','Casper.() is now visible applying cssPseudoClass');
    }).then(function() {
       this.removePseudoClass('hover','#cssPseudo');
       test.assertNotVisible('#cssPseudoRight','Casper.() is now invisible deleting cssPseudoClass');
    }).run(function() {
        test.done();
    });
});

casper.test.begin('hover() tests second solution with Native Event', 3, function(test) {
    casper.start('tests/site/hover.html').on('remote.message', function(msg){console.log(msg);}
    ).then(function() {
       test.assertNotVisible('#cssPseudoRight','Casper.() is not visible because mouse is unused');
    }).then(function() {
       this.mouse.move("#cssPseudo");
       test.assertVisible('#cssPseudoRight','Casper.() is now visible because mouse go over layer');
    }).then(function() {
       this.mouse.move("#elseCss");
       test.assertNotVisible('#cssPseudoRight','Casper.() is now invisible beacause mouse go out');
    }).run(function() {
        test.done();
    });
});
