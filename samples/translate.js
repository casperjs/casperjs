/*jshint strict:false*/
/*global kasperError console phantom require*/

/**
 * Translation using the Google Translate Service.
 *
 * Usage:
 *
 *     $ kasperjs translate.js --target=fr "hello world"
 *     bonjour tout le monde
 */
var system = require('system'),
    kasper = require('kasper').create(),
    format = require('utils').format,
    source = kasper.cli.get('source') || 'auto',
    target = kasper.cli.get('target'),
    text   = kasper.cli.get(0),
    result;

if (!target) {
    kasper.warn('The --target option is mandatory.').exit(1);
}

kasper.start(format('http://translate.google.com/#%s/%s/%s', source, target, text), function() {
    this.fill('form#gt-form', {text: text});
}).waitForSelector('span.hps', function() {
    this.echo(this.fetchText("#result_box"));
});

kasper.run();
