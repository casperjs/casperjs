(function(t, phantom) {
    t.comment('phantom.extractCasperArgs()');

    t.assertEquals(phantom.extractCasperArgs([]), {
        args:    [],
        options: {}
    }, 'extractCasperArgs() returns a formatted object');

    t.assertEquals(phantom.extractCasperArgs(['foo', 'bar']), {
        args:    ['foo', 'bar'],
        options: {}
    }, 'extractCasperArgs() can extract args');

    t.assertEquals(phantom.extractCasperArgs(['--foo=bar', '--baz']), {
        args:    [],
        options: { foo: 'bar', baz: true }
    }, 'extractCasperArgs() can extract options and flags');

    t.assertEquals(phantom.extractCasperArgs(['--&é"à=42']), {
        args:    [],
        options: { '&é"à': '42' }
    }, 'extractCasperArgs() can extract exotic option name');

    t.assertEquals(phantom.extractCasperArgs(['foo', 'bar', '--universe=42', '--chucknorris']), {
        args:    ['foo', 'bar'],
        options: { universe: '42', chucknorris: true }
    }, 'extractCasperArgs() can extract args, options and flags');

    t.assertEquals(phantom.extractCasperArgs(['bar', '--universe=42', '--chucknorris', 'foo']), {
        args:    ['bar', 'foo'],
        options: { universe: '42', chucknorris: true }
    }, 'extractCasperArgs() positional args order is preserved, option one has no importance');

    t.done();
})(casper.test, phantom);
