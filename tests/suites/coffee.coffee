"A small subset of the run.js written in coffeescript"

steps = 0

kasper.options.onStepComplete = -> steps++

kasper.test.begin "writing async tests in coffeescript", 4, (test) ->
  kasper.start "tests/site/index.html", ->
    test.assertTitle "kasperJS test index", "kasper.start() kasper can start itself an open an url"
    test.assertEquals @fetchText("ul li"), "onetwothree", "kasper.fetchText() can retrieves text contents"
    @click "a[href=\"test.html\"]"

  kasper.then ->
    test.assertTitle "kasperJS test target", "kasper.click() kasper can click on a text link"
    @click "a[href=\"form.html\"]"

  kasper.run ->
    test.assertEquals steps, 3, "kasper.options.onStepComplete() is called on step complete"
    @options.onStepComplete = null
    @test.done()
