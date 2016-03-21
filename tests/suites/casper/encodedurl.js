/*eslint strict:0*/

var urlWithEncodedSpace = 'tests/site/has%20space.html';
var urlWithoutSpace = 'tests/site/index.html'; 

var urls = [urlWithEncodedSpace, urlWithoutSpace];
if (casper.cli.options.reverse) urls.reverse();

var phantomVersion = 'phantomjs ' + phantom.version.major + '.' + phantom.version.minor + '.' + phantom.version.patch;

var numPageResourcesRequested = 0;
var numPageResourcesReceived = 0;

casper.on ('page.resource.requested', function ResourceRequested (resource) {
   ++numPageResourcesRequested;
});

casper.on ('page.resource.received', function ResourceReceived (resource) {
   ++numPageResourcesReceived;
});

casper.test.begin(phantomVersion + ' ' + urls[0] + ' then ' + urls[1], 8, function(test) {

   casper.start(urls[0], function CheckResponse1(response1) {
      test.assertEquals(numPageResourcesRequested, 1, 'page.resource.requested 1');
      test.assertEquals(numPageResourcesReceived, 1, 'page.resource.received 1');
      test.assertEquals(response1.status, 200, 'status 200 for ' + urls[0]);
      test.assertEquals(response1.url, casper.filter('open.location', urls[0]) || urls[0], 'opened ' + urls[0]);   // Mimic Casper.prototype.open
            
      casper.thenOpen (urls[1], function CheckResponse2(response2) {
         test.assertEquals(numPageResourcesRequested, 2, 'page.resource.requested 2');
         test.assertEquals(numPageResourcesReceived, 2, 'page.resource.received 2');
         test.assertEquals(response2.status, 200, 'status 200 for ' + urls[1]);
         test.assertEquals(response2.url, casper.filter('open.location', urls[1]) || urls[1], 'opened ' + urls[1]); // Mimic Casper.prototype.open
      });
   });
   
   casper.run(function() {
      test.done();
   });
});
