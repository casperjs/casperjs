###
Download the google logo image onto the local filesystem
###

kasper = require("kasper").create()

kasper.start "http://www.google.fr/", ->
    @echo @download "http://www.google.fr/images/srpr/logo3w.png", "logo.png"

kasper.run()
