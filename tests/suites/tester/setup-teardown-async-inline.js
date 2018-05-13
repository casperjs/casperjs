/*eslint strict:0*/

var setUp, tearDown;

casper.test.begin('setUp() tests', 1, {
  setUp: function(test, globalCasper, callback) {
      setTimeout(function() {
          setUp = true;
          callback();
      }, 50);
  },
  test: function(test) {
    test.assertTrue(setUp, 'Tester.setUp() executed the async setup function');
    test.done();
  }
});

casper.test.begin('tearDown() dummy test', 1, {
  tearDown: function(test, globalCasper, callback) {
      setTimeout(function() {
          tearDown = true;
          callback();
      }, 50);
  },
  test: function(test) {
    test.assertTrue(true); // This is just a dummy test. See the next one.
    test.done();
  }
});

casper.test.begin('tearDown() test', 1, function(test) {
  // This test only ensures that the tearDown function
  // of the previous test was called.
  test.assertTrue(tearDown, 'Tester.tearDown() executed the async tear down function');
  test.done();
})
