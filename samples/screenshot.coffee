###
This script will capture a screenshot of a twitter account page
Usage: $ kasperjs screenshot.coffee <twitter-account> <filename.[jpg|png|pdf]>
###

kasper = require("kasper").create
    viewportSize:
        width: 1024
        height: 768

twitterAccount = kasper.cli.get 0
filename       = kasper.cli.get 1

if not twitterAccount or not filename or not /\.(png|jpg|pdf)$/i.test filename
    kasper
        .echo("Usage: $ kasperjs screenshot.coffee <twitter-account> <filename.[jpg|png|pdf]>")
        .exit(1)

kasper.start "https://twitter.com/#!/#{twitterAccount}", ->
    @waitForSelector ".tweet-row", (->
        @captureSelector filename, "html"
        @echo "Saved screenshot of #{@getCurrentUrl()} to #{filename}"
    ), (->
        @die("Timeout reached. Fail whale?")
        @exit()
    ), 12000

kasper.run()
