# Google sample testing.
#
# Usage:
#     $ kasperjs test googletesting.coffee
kasper.test.begin 'Google search retrieves 10 or more results', 5, (test) ->
    kasper.start "http://www.google.fr/", ->
        test.assertTitle "Google", "google homepage title is the one expected"
        test.assertExists 'form[action="/search"]', "main form is found"
        @fill 'form[action="/search"]', q: "foo", true

    kasper.then ->
        test.assertTitle "foo - Recherche Google", "google title is ok"
        test.assertUrlMatch /q=foo/, "search term has been submitted"
        test.assertEval (->
            __utils__.findAll("h3.r").length >= 10
        ), "google search for \"foo\" retrieves 10 or more results"

    kasper.run -> test.done()

kasper.test.begin "kasperjs.org is first ranked", 1, (test) ->
    kasper.start "http://www.google.fr/", ->
        @fill "form[action=\"/search\"]", q: "kasperjs", true

    kasper.then ->
        test.assertSelectorContains ".g", "kasperjs.org", "kasperjs.org is first ranked"

    kasper.run -> test.done()

