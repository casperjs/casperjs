# A small subset of the run.js written in coffeescript

phantom.injectJs "casper.js"

casper = new phantom.Casper
    faultTolerant: false
    verbose: true
    onStepComplete: -> @test.comment "step completed"

# testing resources
casper.start "tests/site/resources.html", ->
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

# currently opening another page would lead to an error because the resource list gets cleared
# casper.thenOpen "tests/site/test.html", ->
  
casper.run()

