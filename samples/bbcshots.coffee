### Create a mosaic image from all headline photos on BBC homepage
###
casper = require('casper').create()
nbLinks = 0
currentLink = 1
images = []

casper.hide = (selector) ->
    @evaluate (selector) ->
        document.querySelector(selector).style.display = "none"
    , selector: selector

casper.start 'http://www.bbc.co.uk/', ->
    nbLinks = @evaluate ->
        return __utils__.findAll('#carousel_items_items li').length
    @echo "#{nbLinks} items founds"
    # hide navigation arrows
    @hide '.nav_left'
    @hide '.nav_right'
    @mouse.move '#promo_carousel'
    @waitUntilVisible '.autoplay.nav_pause', ->
        @echo 'Moving over pause button'
        @mouse.move '.autoplay.nav_pause'
        @click '.autoplay.nav_pause'
        @echo 'Clicked on pause button'
        @waitUntilVisible '.autoplay.nav_play', ->
            @echo 'Carousel has been paused'
            # hide play button
            @hide '.autoplay'

# Building resulting page and image
buildPage = ->
    @echo 'Build result page'
    fs = require 'fs'
    @viewport 624, 400
    pageHtml = "<html><body style='background:black;margin:0;padding:0'>"
    for image in images
        pageHtml += "<img src='file://#{fs.workingDirectory}/#{image}'><br>"
    pageHtml += "</body></html>"
    fs.write 'result.html', pageHtml, 'w'
    @thenOpen "file://#{fs.workingDirectory}/result.html", ->
        @echo 'Resulting image saved to result.png'
        @capture 'result.png'

# Capture carrousel area
next = ->
    image = "bbcshot#{currentLink}.png"
    images.push image
    @echo "Processing image #{currentLink}"
    @captureSelector image, '.carousel_viewport'
    if currentLink < nbLinks
        @click ".carousel_itemList_li[rel='#{currentLink}']"
        @wait 1000, ->
            @then next
            currentLink++
    else
        @then buildPage

casper.then next

casper.run()
