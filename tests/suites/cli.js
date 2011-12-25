(function(t) {
    var cli = require('cli');

    t.comment('parse()');

    (function(parsed) {
        t.assertEquals(parsed.args, [], 'parse() returns expected positional args array');
        t.assertEquals(parsed.options, {}, 'parse() returns expected options object');
        t.assertEquals(parsed.get(0), undefined, 'parse() does not return inexistant positional arg');
        t.assertEquals(parsed.get('blah'), undefined, 'parse() does not return inexistant option');
    })(cli.parse([]));

    (function(parsed) {
        t.assertEquals(parsed.args, ['foo', 'bar'], 'parse() returns expected positional args array');
        t.assertEquals(parsed.options, {}, 'parse() returns expected options object');
        t.assertEquals(parsed.get(0), 'foo', 'parse() retrieve first positional arg');
        t.assertEquals(parsed.get(1), 'bar', 'parse() retrieve second positional arg');
    })(cli.parse(['foo', 'bar']));

    (function(parsed) {
        t.assertEquals(parsed.args, [], 'parse() returns expected positional args array');
        t.assertEquals(parsed.options, {foo: 'bar', baz: true}, 'parse() returns expected options object');
        t.assertEquals(parsed.get('foo'), 'bar', 'parse() retrieve an option value');
        t.assert(parsed.get('baz'), 'parse() retrieve boolean option flag');
    })(cli.parse(['--foo=bar', '--baz']));

    (function(parsed) {
        t.assertEquals(parsed.args, [], 'parse() returns expected positional args array');
        t.assertEquals(parsed.options, { '&é"à': 42 }, 'parse() returns expected options object');
        t.assertEquals(parsed.get('&é"à'), 42, 'parse() handles options with exotic names');
    })(cli.parse(['--&é"à=42']));

    (function(parsed) {
        t.assertEquals(parsed.args, ['foo & bar', 'baz & boz'], 'parse() returns expected positional args array');
        t.assertEquals(parsed.options, { universe: 42, lap: 13.37, chucknorris: true, oops: false }, 'parse() returns expected options object');
        t.assertEquals(parsed.get('universe'), 42, 'parse() can cast a numeric option value');
        t.assertEquals(parsed.get('lap'), 13.37, 'parse() can cast a float option value');
        t.assertType(parsed.get('lap'), "number", 'parse() can cast a boolean value');
        t.assert(parsed.get('chucknorris'), 'parse() can get a flag value by its option name');
        t.assertType(parsed.get('oops'), "boolean", 'parse() can cast a boolean value');
        t.assertEquals(parsed.get('oops'), false, 'parse() can cast a boolean value');
    })(cli.parse(['foo & bar', 'baz & boz', '--universe=42', '--lap=13.37', '--chucknorris', '--oops=false']));

    t.done();
})(casper.test);
