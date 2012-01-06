casper = require('casper').create()

# listening to a custom event
casper.on 'google.loaded', (title) ->
    casper.echo "Google page title is #{title}"

casper.start 'http://google.com/', ->
    # emitting a custom event
    @emit 'google.loaded', @getTitle()

casper.run()