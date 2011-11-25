# a small subset of the run.js written in coffeescript

phantom.injectJs "casper.js"
casper = new phantom.Casper(
  faultTolerant: false
  verbose: true
)

casper.start "tests/site/index.html", ->
  @test.assertTitle "CasperJS test index", "Casper.start() casper can start itself an open an url"
  @test.comment "fetching"
  @test.assertEquals @fetchText("ul li"), "onetwothree", "Casper.fetchText() can retrieves text contents"
  @test.comment "clicking"
  @click "a[href=\"test.html\"]"

casper.test.comment "then"
casper.then ->
  @test.assertTitle "CasperJS test target", "Casper.click() casper can click on a text link"
  @click "a[href=\"form.html\"]"
  
casper.run()