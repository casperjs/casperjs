###
This script will add a custom HTTP status code handler, here for 404 pages.
###
casper = require('casper').create
    httpStatusHandlers:
        404: (self, resource) ->
            @echo "Resource at #{resource.url} not found (404)", "COMMENT"

casper.start 'http://www.google.com/plop', ->
    @echo 'Done.'
    @exit()

casper.run()
