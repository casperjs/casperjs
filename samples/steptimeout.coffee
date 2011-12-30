failed = [];

casper = require('casper').create
    onStepTimeout: -> failed.push @requestUrl

links = [
    'http://google.com/'
    'http://akei.com/'
    'http://lemonde.fr/'
    'http://liberation.fr/'
    'http://cdiscount.fr/'
]

timeout = ~~casper.cli.get(0)
timeout = 1000 if timeout < 1
casper.options.stepTimeout = timeout

casper.echo "Testing with timeout=#{casper.options.stepTimeout}ms."

casper.start()

casper.each links, (self, link) ->
    @test.comment "Adding #{link} to test suite"
    @thenOpen link, ->
        if @requestUrl in failed
            @test.fail "#{@requestUrl} loaded in less than #{timeout}ms."
        else
            @test.pass "#{@requestUrl} loaded in less than #{timeout}ms."

casper.run -> @test.renderResults true
