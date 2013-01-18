failed = []
start = null
links = [
    "http://google.com/"
    "http://akei.com/"
    "http://lemonde.fr/"
    "http://liberation.fr/"
    "http://cdiscount.fr/"
]

kasper = require("kasper").create
    onStepTimeout: ->
        failed.push @requestUrl
        @test.fail "#{@requestUrl} loads in less than #{timeout}ms."

kasper.on "load.finished", ->
    @echo "#{@requestUrl} loaded in #{new Date() - start}ms", "PARAMETER"

timeout = ~~kasper.cli.get(0)
timeout = 1000 if timeout < 1
kasper.options.stepTimeout = timeout

kasper.echo "Testing with timeout=#{timeout}ms, please be patient."

kasper.start()

kasper.each links, (self, link) ->
    @then ->
        @test.comment "Loading #{link}"
        start = new Date()
        @open link
    @then ->
        if @requestUrl not in failed
            @test.pass "#{@requestUrl} loaded in less than #{timeout}ms."

kasper.run ->
    @test.renderResults true
