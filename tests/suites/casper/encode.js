/*eslint strict:0*/
var fs = require('fs');

casper.test.begin('base64encode() and download() tests', 4, function(test) {
    // FIXME: https://github.com/ariya/phantomjs/pull/364 has been merged, update scheme
    casper.start('file://' + phantom.casperPath + '/tests/site/index.html', function() {
        var imageUrl = 'file://' + phantom.casperPath + '/tests/site/images/phantom.png',
        image = "";
        if (phantom.version.major < 2 ){
            image = this.base64encode(imageUrl);
            test.assertEquals(image.length, 6160, 'Casper.base64encode() can retrieve base64 contents');
        } else {
            test.assertEquals(image.length, 0 , 'Casper.base64encode() can\'t retrieve base64 contents');
        }
        image = this.base64encode(imageUrl,'GET',{},true);
        this.waitForAJAX(imageUrl,function waitForAjaxTest(){
            image = this.getAjaxBase64(imageUrl);
            test.assertEquals(image.length, 6160, 'Casper.base64encode() can retrieve base64 contents');
        }, function onTimeout() {
            test.fail("waitForAJAX timeout occured");
        });

        if (phantom.version.major < 2 ){
            this.download(imageUrl, '__test_logo.png');
            test.assert(fs.exists('__test_logo.png'), 'Casper.download() downloads a file');
            if (fs.exists('__test_logo.png')) {
                fs.remove('__test_logo.png');
            }
        } else {
            test.assert(!fs.exists('__test_logo.png'), 'Casper.download() not downloads a file');
        }
        this.download(imageUrl, '__test_logo2.png','GET',{},true);
        this.waitForDownload(imageUrl,function waitForDownloadTest(){
            test.assert(fs.exists('__test_logo2.png'), 'Casper.download() downloads a file');
            if (fs.exists('__test_logo2.png')) {
                fs.remove('__test_logo2.png');
            }
        },function onTimeout(){
            test.fail("waitForDownload timeout occured");
        });
    }).run(function() {
        test.done();
    });
});
