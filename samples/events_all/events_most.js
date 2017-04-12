/*
Goal is to create an easy way to log any chosen or all events
make sure to "cd" into path eg:cd /where/samples/are
same goes for the script it creates, cd into events_all when calling the events_most.js file
These are due to inability to get the executed filepath directory
You can require('./events_logger'); and call it with different cases

USAGE : 
cd events_all_folder
casperjs --web-security=no events_most.js
	This creates events_log.txt, first_link.html(downloaded from flickr), google.png (captured), logo.png (downloaded from google)
	events_log.txt contains lengthy details and can be useful for debugging purposes
	events are also logged into the console

TODO
trigger remaining events
this.getElementAttribute does not work? actually undefined!?
fix commented out sections : 1 - probably due to some sort of scoping issue, 2 - failure to convert from dom object to string
*/
var casper = require('casper').create({
	pageSettings:{
		userAgent : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.47 Safari/536.11'
	}
});
var logger = require('./events_logger');
logger.log(casper/*, events, _filepath, lambda*/);
casper.start('http://google.com/', function() {
	this.fill('form[action="/search"]', { q: "casperjs" }, true);
});
casper.then(function(){
	this.waitForSelector('#search li a', function(){
//		var url = this.evaluate(function(){ return document.querySelector('#search li a').attributes.href; });
//above returns object, not string, so a url that works for now -> make sure to start with --web-security=no
		var url = 'http://flickr.com';
//		console.log('\r\nurl is ' + url + '\r\n');
		this.then(function(){
			this.download(url, 'first_link.html');
		});
	});
});
casper.then(function(){ this.back(); });
//check if downloading an image works -> due to redirects, make sure to start casperjs with --web-security=no
casper.then(function(){ this.download('http://www.google.com/images/srpr/logo3w.png', 'logo.png'); });
casper.then(function(){ this.forward(); });
casper.then(function(){ this.capture('google.png', { top: 100, left: 100, width: 500, height: 400 }); });
casper.run();