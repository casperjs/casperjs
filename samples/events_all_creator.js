/*
As a sample
	Filesystem usage
	Download usage
	Events logging

Goal is to create a script that uses all events
This script fetches all events from "http://casperjs.org/events-filters.html"
Then creates another script that listen for all the events and tries to trigger most of them (plan to trigger all in the future)
make sure to "cd" into path eg:cd /where/samples/are
same goes for the script it creates, cd into events_all when calling the events_most.js file
These are due to inability to get the executed filepath directory

USAGE : 
cd /$samples_folder
casperjs events_all_creator.js
	now what should be created
	folder events_all with the events_most.js file inside. (when all events are implemented, will be renamed events_all.js)
	it is created in the directory script is run from
Then
cd events_all
casperjs --web-security=no events_most.js
	This creates events_most_log.txt, first_link.html(downloaded from flickr), google.png (captured), logo.png (downloaded from google)
	events_most_log.txt contains lengthy details and can be useful for debugging purposes
	events are also logged into the console

TODO
Is there a way to require('local-file?')
Then abstract the events debugging into a module
eg
var casper = require('casper_debugger').create(overriding_object);
casper.start( ... )
casper.run()
and get the same effect?

trigger remaining events
this.getElementAttribute does not work? actually undefined!?
fix commented out sections : 1 - probably due to some sort of scoping issue, 2 - failure to convert from dom object to string
*/
var fs = require('fs');
var casper = require('casper').create();
function get_all_casper_events(){
	var arr = [];
	$('table[caption="Casper events"] tbody > tr > td:first-of-type > code').each(function(){
		arr.push($(this).html());
	});
	return arr;
}
function casper_event_template(event_name){
	/*
	return 'casper.on(\'' + event_name + '\', function(context) {\r\n' +
	'	console.log(\'' + event_name + ' context is \', context);\r\n' +
	'});';
	*/
	return 'casper.on(\'' + event_name + '\', function(context) { cnsl_info(\'' + event_name + '\', context); });';
}
var base_path = fs.absolute('') + fs.separator;

//make sure to execute casperjs from the same directory, otherwise you will need to move the created directory later
fs.makeDirectory( base_path + 'events_all');//create its own folder so that it does not clutter the samples folder
var begin = [
	"var casper = require('casper').create({",
	"	pageSettings:{",
	"		userAgent : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.47 Safari/536.11'",
	"	}",
	"});",
	"var utils = require('utils');",
	"var fs = require('fs');",
	"var base_path = fs.absolute('') + fs.separator;",
	"var filepath = base_path + 'events_most_log.txt';",
	"fs.write( filepath, '', 'w' );",
	"var cnsl_info = function(event_name, context){",
	"	if( ! event_name ){ return; }",
	"	console.log( event_name );",
	"	utils.dump(context);",
	"	fs.write( filepath, event_name + '\\r\\n' + utils.serialize(context)+ '\\r\\n', 'a' );",
	"};"
];
var end = [
	"casper.start('http://google.com/', function() {",
/*	
	"casper.waitForSelector('img[src$="png"]', function(){",
	"	var img_url = this.evaluate(function(){",
	"		return document.querySelector('img[src$="png"]').attributes.src;",
	"	});",
	"	this.then(function(){",
	"		this.download(img_url, 'first_png_tag.png');",
	"	});",
	"});"
*/	
	"	this.fill('form[action=\"/search\"]', { q: \"casperjs\" }, true);",
	"});",
	
	
	"casper.then(function(){",
	"	this.waitForSelector('#search li a', function(){",
	"//		var url = this.evaluate(function(){ return document.querySelector('#search li a').attributes.href; });",
	"//above returns object, not string, so a url that works for now -> make sure to start with --web-security=no",
	"		var url = 'http://flickr.com';",
	"//		console.log('\\r\\nurl is ' + url + '\\r\\n');",
	"		this.then(function(){",
	"			this.download(url, 'first_link.html');",
	"		});",
	"	});",
	"});",
	"casper.then(function(){ this.back(); });",
	"//check if downloading an image works -> due to redirects, make sure to start casperjs with --web-security=no",
	"casper.then(function(){ this.download('http://www.google.com/images/srpr/logo3w.png', 'logo.png'); });",
	"casper.then(function(){ this.forward(); });",
	"casper.then(function(){ this.capture('google.png', { top: 100, left: 100, width: 500, height: 400 }); });",
	"casper.run();"
];
var text = [];
casper.start('http://casperjs.org/events-filters.html');
casper.then(function(){
	events = this.evaluate( get_all_casper_events );
	this.then(function(){
		this.each(events, function(self, e){
			text.push( casper_event_template(e) );
		});
		fs.write( base_path + 'events_all/events_most.js', begin.concat(text, end).join('\r\n'), 'w' );
		//goal is to provide examples for all possible events
		//currently many events are missing. therefore it is named events_most.js
	});
});
casper.run();