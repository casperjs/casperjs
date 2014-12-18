/*global casper, __utils__*/
/*jshint strict:false*/
var x = require('casper').selectLinkText;

casper.test.begin('link text tests', 10, function(test) {
    casper.start('tests/site/index.html', function() {
        test.assertExists({
            type: 'link_text',
            path: 'form'
        }, 'link text selector can find an <a>tag with "form" text');
        test.assertExists({
            type: 'link_text',
            path: 'an other link to the form'
        }, 'link text selector, without "text-transform" style", can find an element');
        test.assertExists({
            type: 'link_text',
            path: 'AN UPPERCASE LINK TO THE FORM'
        }, 'link text selector, without upercase style, can find an element');
        test.assertExists({
            type: 'link_text',
            path: 'a lowercase link to the form'
        }, 'link text selector, with lowercase style, can find an element');
	test.assertExists({
            type: 'link_text',
            path: 'A Capitalize Link To The Form'
        }, 'link text selector, with capitalize style, selector can find an element');
        test.assertDoesntExist({
            type: 'link_text',
            path: 'forms'
        }, 'link text selector does not retrieve a nonexistent element');
        test.assertDoesntExist({
            type: 'link_text',
            path: 'invisible'
        }, 'link text selector retrieve a nonvisible element');
        test.assertExists(x('form'), 'selectLinkText() shortcut can find an element as well');
        test.assertEvalEquals(function() {
            return __utils__.findAll({type: 'link_text', path: 'form'}).length;
        }, 1, 'Correct number of elements are found');
    });

    casper.thenClick(x('form'), function() {
        test.assertTitle('CasperJS test form', 'Clicking link text works as expected');
    });

    casper.run(function() {
        test.done();
    });
});
