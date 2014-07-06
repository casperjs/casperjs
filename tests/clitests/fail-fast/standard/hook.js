/* global casper */

casper.test.on('fail', function doSomething() {
  'use strict';
  casper.echo('fail event fired!');
});
casper.test.begin('hook', 0, function(t) {
  'use strict';
  t.done();
});
