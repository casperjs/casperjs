links =
    'http://edition.cnn.com/': 0
    'http://www.nytimes.com/': 0
    'http://www.bbc.co.uk/': 0
    'http://www.guardian.co.uk/': 0

class Fantomas extends require('casper').Casper
    countLinks: ->
        @evaluate ->
            __utils__.findAll('a').length

    renderJSON: (what) ->
        @echo JSON.stringify what, null, '  '

fantomas = new Fantomas
    loadImages:  false
    logLevel:    "debug"
    verbose:     true

fantomas.start()

for url of links
    do (url) ->
        fantomas.thenOpen url, ->
            links[url] = @countLinks()

fantomas.run ->
    @renderJSON links
    @exit()
