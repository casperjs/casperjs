casper.start "tests/site/resources.html", ->
  @test.assertEquals @resources.length, 1, "only one resource found"
  onTime = ->
    @test.assertEquals(
      @resources.length
      2
      "two resources found"
    )
    @test.assertResourceExists(
      /phantom\.png/i
      "phantom image found via test RegExp"
    )
    @test.assertResourceExists(
      (res) -> res.url.match "phantom.png"
      "phantom image found via test Function"
    )
    @test.assertResourceExists(
      "phantom.png"
      "phantom image found via test String"
    )
  onTimeout = -> @test.fail "waitForResource timeout occured"
  @waitForResource "phantom.png", onTime, onTimeout

casper.run(-> @test.done())
