/*global exports console require*/

var fs = require('fs');
var utils = require('utils');
var filepath;
var all_events = ["back", "capture.saved", "click", "die", "downloaded.file", "error", "exit", "fill", "forward", "http.auth", "http.status.[code]", "load.started", "load.failed", "load.finished", "log", "mouse.click", "mouse.down", "mouse.move", "mouse.up", "navigation.requested", "open", "page.created", "page.error", "page.initialized", "remote.alert", "remote.message", "resource.received", "resource.requested", "run.complete", "run.start", "starting", "started", "step.added", "step.complete", "step.created", "step.start", "step.timeout", "timeout", "url.changed", "viewport.changed", "wait.done", "wait.start", "waitFor.timeout"];

function assign_filepath(_filepath){
	if( ! _filepath ){
		var base_path = fs.absolute('') + fs.separator;
		filepath = base_path + 'events_log.txt';
	}
	else{ filepath = _filepath; }
}
function assign_event(casper, event, lambda){
	casper.on(event, function(context) { lambda(event, context); } );
}
function cnsl_info(event_name, context){
	if( ! event_name ){ return; }
	console.log( event_name );
	utils.dump(context);
	fs.write( filepath, event_name + '\r\n' + utils.serialize(context)+ '\r\n', 'a' );
}
function log_events(casper, events, _filepath, lambda){
	if( ! events || events === 'all'){ events = all_events; }
	assign_filepath(_filepath);
	fs.write( filepath, '', 'w' );
	if( ! lambda ){ lambda = cnsl_info; }
	for(var i = 0; i < events.length; i++){
		assign_event(casper, events[i], lambda);
	}
}
function log_all_events(casper, _filepath, lambda){
	//just here if in case someone needs to make changes per event
	assign_filepath(_filepath);
	if( ! lambda ){ lambda = cnsl_info; }
	casper.on('back', function(context) { lambda('back', context); });
	casper.on('capture.saved', function(context) { lambda('capture.saved', context); });
	casper.on('click', function(context) { lambda('click', context); });
	casper.on('die', function(context) { lambda('die', context); });
	casper.on('downloaded.file', function(context) { lambda('downloaded.file', context); });
	casper.on('error', function(context) { lambda('error', context); });
	casper.on('exit', function(context) { lambda('exit', context); });
	casper.on('fill', function(context) { lambda('fill', context); });
	casper.on('forward', function(context) { lambda('forward', context); });
	casper.on('http.auth', function(context) { lambda('http.auth', context); });
	casper.on('http.status.[code]', function(context) { lambda('http.status.[code]', context); });
	casper.on('load.started', function(context) { lambda('load.started', context); });
	casper.on('load.failed', function(context) { lambda('load.failed', context); });
	casper.on('load.finished', function(context) { lambda('load.finished', context); });
	casper.on('log', function(context) { lambda('log', context); });
	casper.on('mouse.click', function(context) { lambda('mouse.click', context); });
	casper.on('mouse.down', function(context) { lambda('mouse.down', context); });
	casper.on('mouse.move', function(context) { lambda('mouse.move', context); });
	casper.on('mouse.up', function(context) { lambda('mouse.up', context); });
	casper.on('navigation.requested', function(context) { lambda('navigation.requested', context); });
	casper.on('open', function(context) { lambda('open', context); });
	casper.on('page.created', function(context) { lambda('page.created', context); });
	casper.on('page.error', function(context) { lambda('page.error', context); });
	casper.on('page.initialized', function(context) { lambda('page.initialized', context); });
	casper.on('remote.alert', function(context) { lambda('remote.alert', context); });
	casper.on('remote.message', function(context) { lambda('remote.message', context); });
	casper.on('resource.received', function(context) { lambda('resource.received', context); });
	casper.on('resource.requested', function(context) { lambda('resource.requested', context); });
	casper.on('run.complete', function(context) { lambda('run.complete', context); });
	casper.on('run.start', function(context) { lambda('run.start', context); });
	casper.on('starting', function(context) { lambda('starting', context); });
	casper.on('started', function(context) { lambda('started', context); });
	casper.on('step.added', function(context) { lambda('step.added', context); });
	casper.on('step.complete', function(context) { lambda('step.complete', context); });
	casper.on('step.created', function(context) { lambda('step.created', context); });
	casper.on('step.start', function(context) { lambda('step.start', context); });
	casper.on('step.timeout', function(context) { lambda('step.timeout', context); });
	casper.on('timeout', function(context) { lambda('timeout', context); });
	casper.on('url.changed', function(context) { lambda('url.changed', context); });
	casper.on('viewport.changed', function(context) { lambda('viewport.changed', context); });
	casper.on('wait.done', function(context) { lambda('wait.done', context); });
	casper.on('wait.start', function(context) { lambda('wait.start', context); });
	casper.on('waitFor.timeout', function(context) { lambda('waitFor.timeout', context); });
}

exports.log = log_events;
exports.log_all = log_all_events;
