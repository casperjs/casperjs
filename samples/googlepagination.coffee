# Capture multiple pages of google search results
#
# usage:  casperjs googlepagination.coffee my search terms
#
# (all arguments will be used as the query)

casper = require('casper').create(verbose: true, logLevel: "debug")
currentPage = 1

if casper.cli.args.length == 0
  casper.echo "usage: $ casperjs my search terms"
  casper.exit()

processPage = ->
  casper.echo "capturing page #{currentPage}"
  casper.capture "google-results-p#{currentPage}.png"

  # don't go too far down the rabbit hole
  return if currentPage >= 5

  if casper.exists "#pnnext"
    currentPage++
    casper.echo "requesting next page: #{currentPage}"
    #casper.thenClick("#pnnext").then(processPage)
    url = @getCurrentUrl()
    casper.thenClick("#pnnext").then ->
      check = -> url != @getCurrentUrl()
      @waitFor check, processPage
  else
    casper.echo "that's all, folks."

casper.start 'http://google.fr/', ->
  @fill 'form[action="/search"]',  q: casper.cli.args.join(' '), true

casper.then processPage

casper.run()
