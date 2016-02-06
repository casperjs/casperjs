/*global casper*/
/*jshint strict:false*/
casper.test.begin('newPage() tests', 5, function(test) {
    casper.start('tests/site/index.html', function() {
        test.assertTitle('CasperJS test index', 'Casper.start() opened the first page');
        test.assertEval(function() {
            return typeof(__utils__) === "object";
        }, 'Casper.start() injects ClientUtils instance within remote DOM');
    }).then(function(){
        casper.newPage();
        casper.thenOpen('tests/site/page1.html', function(){
            test.assertTitle('CasperJS test page 1', 'casper.newPage() created a new page object');
            test.assertEval(function() {
                return typeof(__utils__) === "object";
            }, 'Casper.newPage() injects ClientUtils instance within remote DOM');
           });
    }).run(function() {
        test.done();
    });
    test.assert(casper.started, 'Casper.start() started');
});
