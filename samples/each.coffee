kasper = require("kasper").create()

links = [
    "http://google.com/"
    "http://yahoo.com/"
    "http://bing.com/"
]

kasper.start()

kasper.each links, (self, link) ->
    @thenOpen link, -> @echo "#{@getTitle()} - #{link}"

kasper.run()
