/*eslint strict:0*/
/*global CasperError, console*/

/**
 * Asynchronous evaluate script
 */


var casper = require("casper").create();


casper.start('http://casperjs.org').then(function() {
    this.echo("CasperJS connected.");
});

casper.then(function(){
    console.log('Synchronous mode, title: "' + this.evaluate(function() {
        return document.title;
    }) + '"');
});

casper.then(function(){
    this.runScript(function() {
        return document.title;
    }, function callback(ret){
       console.log('Asynchronous defaut return, title: "' + ret + '"');
    });

    this.runScript(function() {
        return document.title;
    }, function callback(ret) {
        console.log('Asynchronous same mode, title: "' + ret + '"');
    });

    this.runScript(function() {
        callCasper(document.title);
        return true;
    }, function callback(ret) {
       console.log('Asynchronous force callback, title: "' + ret + '"');
    });

    this.runScript(function() {
        setTimeout(function() {
	    callCasper(document.title);
        }, 1000);
    }, function callback(ret) {
       console.log('Asynchronous with setTimeout (1s), title: "' + ret + '"');
    });

    this.runScript(function() {
        document.addEventListener('click',function(e) {
            callCasper(document.title);
        },false);
        setTimeout(function(){
            __utils__.click('body');
        },1000);
    }, function callback(ret) {
       console.log('Asynchronous on Event Listener, title: "' + ret + '"');
    });
});

casper.run(function() {
    this.echo('terminated');
    this.exit();
});
