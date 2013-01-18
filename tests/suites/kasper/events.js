/*global kasper*/
/*jshint strict:false*/
kasper.test.begin('events', 2, function(test) {
    kasper.plopped = false;
    kasper.once("plop", function() {
        this.plopped = true;
    });
    test.assert(Object.keys(kasper._events).some(function(i) {
        return i === "plop";
    }), "on() has set an event handler");
    kasper.emit("plop");
    test.assert(kasper.plopped, "emit() emits an event");
    test.done();
});

kasper.test.begin('filters', 3, function(test) {
    kasper.foo = 0;
    kasper.setFilter("test", function(a) {
        this.foo = 42;
        return a + 1;
    });
    test.assert(Object.keys(kasper._filters).some(function(i) {
        return i === "test";
    }), "setFilter() has set a filter");
    test.assertEquals(kasper.filter("test", 1), 2, "filter() filters a value");
    test.assertEquals(kasper.foo, 42, "filter() applies the correct context");
    delete kasper.foo;
    test.done();
});
