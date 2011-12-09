# A small subset of the run.js written in coffeescript

phantom.injectJs "casper.js"

casper = new phantom.Casper
    faultTolerant: false
    verbose: true

step = 0

# testing resources
casper.start "tests/site/resources.html", ->
  @test.assertEquals ++step, 1, "step 1"
  @wait 1000, ->
    @test.assertEquals ++step, 2, "step 2"

casper.wait 500, ->
  @test.assertEquals ++step, 3, "step 3"

casper.waitForSelector(
  '#noneExistingSelector'
  -> @test.fail "should run into timeout"
  -> @test.assertEquals ++step, 4, "step 4 sucessfully timed out"
)
casper.then ->
  @test.assertEquals ++step, 5, "step 5"
  @wait 1000, ->
    @test.assertEquals ++step, 6, "step 6"
  @wait 500, ->
    @test.assertEquals ++step, 7, "step 7"

casper.then ->
  @test.assertEquals ++step, 8, "last step"


casper.run()

