kasper = require("kasper").create()

# listening to a custom event
kasper.on "google.loaded", (title) ->
    @echo "Google page title is #{title}"

kasper.start "http://google.com/", ->
    # emitting a custom event
    @emit "google.loaded", @getTitle()

kasper.run()
