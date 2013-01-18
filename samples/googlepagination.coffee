###
Capture multiple pages of google search results

Usage: $ kasperjs googlepagination.coffee my search terms

(all arguments will be used as the query)
###

kasper = require("kasper").create()
currentPage = 1

if kasper.cli.args.length is 0
    kasper
        .echo("Usage: $ kasperjs googlepagination.coffee my search terms")
        .exit(1)

processPage = ->
    @echo "capturing page #{currentPage}"
    @capture "google-results-p#{currentPage}.png"

    # don't go too far down the rabbit hole
    return if currentPage >= 5

    if @exists "#pnnext"
        currentPage++
        @echo "requesting next page: #{currentPage}"
        url = @getCurrentUrl()
        @thenClick("#pnnext").then ->
            @waitFor (->
                url isnt @getCurrentUrl()
            ), processPage
    else
        @echo "that's all, folks."

kasper.start "http://google.fr/", ->
    @fill 'form[action="/search"]',  q: kasper.cli.args.join(" "), true

kasper.then processPage

kasper.run()
