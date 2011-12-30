articles = []
CasperClass = require('casper').Casper

###
Adds two new methods to the Casper prototype: fetchTexts and renderJSON.
###
CasperClass.extend
    # Adds a new navigation step for casper; basically it will:
    #
    # 1. open an url,
    # 2. on loaded, will fetch all contents retrieved through the provided
    #    CSS3 selector and return them in a formatted object.
    fetchTexts: (location, selector) ->
        @thenOpen location, ->
            fetch = (selector) ->
                elements = document.querySelectorAll(selector)
                Array::map.call elements, (e) -> e.innerText
            texts = @evaluate fetch, selector: selector
            articles = articles.concat texts

    # Echoes a JSON output of the fetched results and exits phantomjs.
    renderJSON: (what) ->
        @echo JSON.stringify what, null, '  '
        @exit()

casper = new CasperClass
    loadImages:  false
    loadPlugins: false
    logLevel:    "debug"
    verbose:     true

casper.start()

# all article titles are stored in <h3>
casper.fetchTexts 'http://www.liberation.fr/', 'h3'

# all article titles are stored in <h2 class="article">
casper.fetchTexts 'http://www.lemonde.fr/', 'h2.article'

casper.run -> @renderJSON articles
