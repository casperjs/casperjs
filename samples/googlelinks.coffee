links = []
kasper = require("kasper").create()

getLinks = ->
    links = document.querySelectorAll("h3.r a")
    Array::map.call links, (e) ->
        try
            (/url\?q=(.*)&sa=U/).exec(e.getAttribute("href"))[1]
        catch e
            e.getAttribute "href"

kasper.start "http://google.fr/", ->
    # search for 'kasperjs' from google form
    @fill "form[action=\"/search\"]", q: "kasperjs", true

kasper.then ->
    # aggregate results for the 'kasperjs' search
    links = @evaluate(getLinks)
    # now search for 'phantomjs' by fillin the form again
    @fill "form[action=\"/search\"]", q: "phantomjs", true

kasper.then ->
    # aggregate results for the 'phantomjs' search
    links = links.concat(@evaluate(getLinks))

kasper.run ->
    # echo results in some pretty fashion
    @echo links.length + " links found:"
    @echo " - " + links.join("\n - ")
    @exit()
