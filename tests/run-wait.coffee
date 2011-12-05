# A small subset of the run.js written in coffeescript

phantom.injectJs "casper.js"

casper = new phantom.Casper
    faultTolerant: false
    verbose: true

# testing resources
casper.start "tests/site/resources.html", ->
  @test.comment "step 1"

casper.wait 1000, ->
  @test.comment "step 2"

casper.wait 500, ->
  @test.comment "step 3"

casper.waitForSelector(
  '#noneExistingSelector'
  -> @test.comment "step 4 - wait passed"
  -> @test.comment "step 4 - wait timed out"
)
casper.then ->
  @test.comment "step 5"
  @test.comment "wait for it ..."
  @wait 1000, ->
    @test.comment "... wait for it ..."
  @wait 500, ->
    @test.comment "... done!"

casper.run()

