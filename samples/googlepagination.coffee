""" Capture multiple pages of google search results

    usage:  casperjs googlepagination.coffee my search terms

    (all arguments will be used as the query)
"""
casper = require('casper').create()

if casper.cli.args.length == 0
  casper.echo "usage: $ casperjs my search terms"
  casper.exit()

casper.start 'http://google.com', ->
  @fill 'form[name=f]',  q: casper.cli.args.join(' '), true
  @click 'input[value="Google Search"]'

casper.then ->
  # google's being all ajaxy, wait for results to load...
  @waitForSelector 'table#nav', ->
    processPage = (cspr) ->
      currentPage = Number cspr.evaluate(-> document.querySelector('table#nav td.cur').innerText), 10
      currentPage = 1 if currentPage == 0
      cspr.capture "google-results-p#{ currentPage }.png"

      # don't go too far down the rabbit hole
      return if currentPage >= 5

      cspr.evaluate ->
        if nextLink = document.querySelector('table#nav td.cur').nextElementSibling?.querySelector('a')
          nextLink.setAttribute "id", "next-page-of-results"

      nextPage = "a#next-page-of-results"
      if cspr.exists nextPage
        cspr.echo "requesting next page..."
        cspr.thenClick(nextPage).then(processPage)
      else
        cspr.echo "that's all, folks."

    processPage(casper)

casper.run()
