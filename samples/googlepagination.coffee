# get multiple pages of google search results
#
#   usage:  phantomjs googlepagination.coffee my search terms
#
#   (all arguments will be used as the query)
#
if not phantom.casperLoaded
    console.log "This script is intended to work with CasperJS, using its executable."
    phantom.exit 1

links = []
casper = new phantom.Casper

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
          nextLink.setAttribute 'id', 'next-page-of-results'

      nextPage = 'a#next-page-of-results'
      if cspr.exists nextPage
        cspr.echo 'requesting next page...'
        cspr.thenClick(nextPage).then(processPage)
      else
        cspr.echo "that's all, folks."

    processPage(casper)

casper.run -> @exit()
