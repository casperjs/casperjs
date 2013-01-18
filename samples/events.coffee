###
This script will add a custom HTTP status code handler, here for 404 pages.
###

kasper = require("kasper").create()

kasper.on "http.status.200", (resource) ->
    @echo "#{resource.url} is OK", "INFO"

kasper.on "http.status.301", (resource) ->
    @echo "#{resource.url} is permanently redirected", "PARAMETER"

kasper.on "http.status.302", (resource) ->
    @echo "#{resource.url} is temporarily redirected", "PARAMETER"

kasper.on "http.status.404", (resource) ->
    @echo "#{resource.url} is not found", "COMMENT"

kasper.on "http.status.500", (resource) ->
    @echo "#{resource.url} is in error", "ERROR"

links = [
    "http://google.com/"
    "http://www.google.com/"
    "http://www.google.com/plop"
]

kasper.start()

kasper.each links, (self, link) ->
    self.thenOpen link, ->
        @echo "#{link} loaded"

kasper.run()
