###
Capture multiple pages of google search results

usage:  casperjs googlepagination.coffee my search terms

(all arguments will be used as the query)
###

casper = require('casper').create()
currentPage = 1

if casper.cli.args.length is 0
  casper
      .echo("Usage: $ casperjs my search terms")
      .exit(1)

processPage = ->
  @echo "capturing page #{currentPage}"
  @capture "google-results-p#{currentPage}.png"

  # don't go too far down the rabbit hole
  return if currentPage >= 5

  if @exists "#pnnext"
    currentPage++
    @echo "requesting next page: #{currentPage}"
    #@thenClick("#pnnext").then(processPage)
    url = @getCurrentUrl()
    @thenClick("#pnnext").then ->
      check = -> url != @getCurrentUrl()
      @waitFor check, processPage
  else
    @echo "that's all, folks."

casper.start 'http://google.fr/', ->
  @fill 'form[action="/search"]',  q: casper.cli.args.join(' '), true

casper.then processPage

casper.run()
