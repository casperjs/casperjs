# Capture multiple pages of google search results
#
# usage:  casperjs googlepagination.coffee my search terms
#
# (all arguments will be used as the query)

casper = require('casper').create()
currentPage = 1

if casper.cli.args.length == 0
  casper.echo "usage: $ casperjs my search terms"
  casper.exit()

processPage = ->
  casper.echo "capturing page #{currentPage}"
  casper.capture "google-results-p#{ currentPage }.png"

  # don't go too far down the rabbit hole
  return if currentPage >= 5

  if casper.exists "#pnnext"
    currentPage++
    casper.echo "requesting next page: #{currentPage}"
    casper.thenClick("#pnnext").then(processPage)
  else
    casper.echo "that's all, folks."

casper.start 'http://google.fr/', ->
  @fill 'form[action="/search"]',  q: casper.cli.args.join(' '), true

casper.then ->
  # google's being all ajaxy, wait for results to load...
  @waitForSelector 'table#nav', => processPage(casper)

casper.run()
