kasper.test.begin "resources tests", 5, (test) ->
  kasper.start "tests/site/resources.html", ->
    test.assertEquals @resources.length, 1, "only one resource found"

    onTime = ->
      test.assertEquals(
        @resources.length
        2
        "two resources found"
      )
      test.assertResourceExists(
        /dummy\.js/i
        "phantom image found via test RegExp"
      )
      test.assertResourceExists(
        (res) -> res.url.match "dummy.js"
        "phantom image found via test Function"
      )
      test.assertResourceExists(
        "dummy.js"
        "phantom image found via test String"
      )

    onTimeout = -> test.fail "waitForResource timeout occured"

    @waitForResource "dummy.js", onTime, onTimeout

  kasper.run(-> test.done())
