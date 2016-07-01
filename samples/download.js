/*eslint strict:0*/
/*global CasperError, console, phantom, require*/

/**
 * download the google logo image onto the local filesystem
 */

var casper = require("casper").create();

casper.start("http://www.google.fr/", function() {
    this.download("http://www.google.fr/images/srpr/logo3w.png", "logo.png",'GET',{},true);
});
casper.then(function(){
    this.waitForDownload("http://www.google.fr/images/srpr/logo3w.png",function(){
        console.log('download sucess');
    }, function(){
        console.log('download failed');
    });
});
casper.run();
