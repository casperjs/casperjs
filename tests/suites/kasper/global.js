/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('getGLobal() tests', 3, function(test) {
    kasper.start('tests/site/global.html', function() {
        test.assertEquals(this.getGlobal('myGlobal'), 'awesome string',
            'kasper.getGlobal() can retrieve a remote global variable');
        test.assertEquals(this.getGlobal('myObject').foo.bar, 'baz',
            'kasper.getGlobal() can retrieves a serializable object');
        test.assertRaises(this.getGlobal, ['myUnencodableGlobal'],
            'kasper.getGlobal() does not fail trying to encode an unserializable global');
    }).run(function() {
        test.done();
    });
});
