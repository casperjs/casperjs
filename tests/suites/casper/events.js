// filters

casper.foo = 0;
casper.setFilter("test", function(a) {
    this.foo = 42;
    return a + 1;
});

casper.test.assert(Object.keys(casper._filters).some(function(i) {
    return i === "test";
}), "setFilter() has set a filter");

casper.test.assertEquals(casper.filter("test", 1), 2, "filter() filters a value");
casper.test.assertEquals(casper.foo, 42, "filter() applies the correct context");

delete casper.foo;

casper.test.done();