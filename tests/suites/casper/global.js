/*global casper*/
/*jshint strict:false*/
casper.test.begin('getGLobal() tests', 4, function(test) {
    casper.start('tests/site/global.html', function() {
        test.assertEquals(this.getGlobal('myGlobal'), 'awesome string',
            'Casper.getGlobal() can retrieve a remote global variable');
        test.assertEquals(this.getGlobal('myObject').foo.bar, 'baz',
            'Casper.getGlobal() can retrieves a serializable object');
        test.assertEquals(this.getGlobal('myObject["foo"].bar'), 'baz',
            'Casper.getGlobal() can retrieves a remote sub-property');
        test.assertRaises(this.getGlobal, ['myUnencodableGlobal'],
            'Casper.getGlobal() does not fail trying to encode an unserializable global');
    }).run(function() {
        test.done();
    });
});
