###
This script will capture a screenshot of a WebGL website
Usage: $ casperjs --engine=slimerjs webgl_screenshot.coffee <filename.[jpg|png|pdf]>
Prerequisite: brew install slimerjs
Prerequisite: SLIMERJSLAUNCHER must be set, see http://docs.slimerjs.org/current/installation.html#configuring-slimerjs
###

casper = require("casper").create
    viewportSize:
        width: 1024
        height: 768

filename       = casper.cli.get 0

if not filename or not /\.(png|jpg|pdf)$/i.test filename
    casper
        .echo("Usage: $ casperjs --engine=slimerjs webgl_screenshot.coffee <filename.[jpg|png|pdf]>")
        .exit(1)

casper.start "http://webglsamples.googlecode.com/hg/blob/blob.html", ->
    @waitForSelector "#viewContainer", (->
        @captureSelector filename, "html"
        @echo "Success. Saved screenshot to #{filename}"
    ), (->
        @die("Timeout reached. Website down?")
        @exit()
    ), 12000

casper.run()
