/*global casper*/
/*jshint strict:false, maxstatements: 99*/

casper.test.begin('reload() tests', 3, function(test) {
    var formUrl = 'tests/site/form.html';

    casper.start(formUrl, function() {
      this.fill("form", {email: "foo@foo.com"}, false);
    });
    casper.once("page.resource.requested", function(resource) {
        test.assert(resource.url.indexOf(formUrl) > 0);
    }).reload(function() {
        test.assertUrlMatches(formUrl);
        test.assertField("email", "");
    }).run(function() {
        test.done();
    });
});
