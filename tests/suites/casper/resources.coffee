do(casper) ->
  casper.onError = ->
    console.log 'err'
  casper.start "tests/site/resources.html", ->
    console.log 'loaded'
    @test.assertEquals @resources.length, 1, "only one resource found"
    @waitForResource "phantom.png", ->
      @test.assertEquals(
        @resources.length
        2
        "two resources found"
      )
      @test.assertResourceExists(
        (res) -> res.url.match "phantom.png"
        "phantom image found via test function"
      )
      @test.assertResourceExists(
        "phantom.png"
        "phantom image found via test string"
      )

  casper.run(-> @test.done())
