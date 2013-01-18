kasper = require("kasper").create verbose: true

countLinks = ->
    document.querySelectorAll('a').length

suites = [
    ->
        @echo "Suite 1"
        @start "http://google.com/", -> @echo "Page title: #{@getTitle()}"
        @then -> @echo "#{@evaluate(countLinks)} links"
    ->
        @echo "Suite 2"
        @start "http://yahoo.com/", -> @echo "Page title: #{@getTitle()}"
        @then -> @echo "#{@evaluate(countLinks)} links"
    ->
        @echo "Suite 3"
        @start "http://bing.com/", -> @echo "Page title: #{@getTitle()}"
        @then -> @echo "#{@evaluate(countLinks)} links"
]

kasper.start()

kasper.then ->
    @echo("Starting")

currentSuite = 0;

check = ->
    if suites[currentSuite]
        suites[currentSuite].call @
        currentSuite++;
        kasper.run check
    else
        @echo "All done."
        @exit()

kasper.run check
