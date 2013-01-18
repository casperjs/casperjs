/*jshint strict:false*/
/*global kasperError kasper console phantom require*/
/**
 * Google sample testing.
 *
 * Usage:
 *
 *     $ kasperjs test googletesting.js
 */
kasper.test.begin('Google search retrieves 10 or more results', 5, function suite(test) {
    kasper.start("http://www.google.fr/", function() {
        test.assertTitle("Google", "google homepage title is the one expected");
        test.assertExists('form[action="/search"]', "main form is found");
        this.fill('form[action="/search"]', {
            q: "kasperjs"
        }, true);
    });

    kasper.then(function() {
        test.assertTitle("kasperjs - Recherche Google", "google title is ok");
        test.assertUrlMatch(/q=kasperjs/, "search term has been submitted");
        test.assertEval(function() {
            return __utils__.findAll("h3.r").length >= 10;
        }, "google search for \"kasperjs\" retrieves 10 or more results");
    });

    kasper.run(function() {
        test.done();
    });
});

kasper.test.begin('kasperjs.org is first ranked', 1, function suite(test) {
    kasper.start("http://www.google.fr/", function() {
        this.fill('form[action="/search"]', {
            q: "kasperjs"
        }, true);
    });

    kasper.then(function() {
        test.assertSelectorContains(".g", "kasperjs.org", "kasperjs.org is first ranked");
    });

    kasper.run(function() {
        test.done();
    });
});
