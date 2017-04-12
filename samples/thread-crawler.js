/*jshint strict:false*/
/*global CasperError, console, phantom, require*/

var Casper = require('casper').Casper;
var Pool = require('generic-pool').Pool;
var async = require('async');
var _ = require('lodash');
var UserAgents = require('./useragents.json');

// The base links array
var links = [
    "http://en.wikipedia.org"
];

var maxThreads = 3;
var maxThreadAge = 3;
var trimHashes = true;
var stayInRange = true;
var skipDupes = true;

var start = Date.now();
var completed = 0;

var tasks = links.map(function (link, index) {
    return {
        uri: link
    };
});

var RX = {
    isHTML: /text\/html/,
    getNum: /\d+/
};
var pool = Pool({
    name     : 'casper',
    create   : function(callback) {
        var casper = new Casper({
            verbose: true
        });
        casper.crawledPages = 0;
        callback(null, casper);
    },
    destroy  : function (casper) {
        casper.exit();
    },
    max      : maxThreads,
    idleTimeoutMillis : 30000
});

var q = async.queue(function (task, asyncCheckIn) {
    pool.acquire(function(err, casper) {
        casper.crawledPages++;
        runTask(task, casper, function () {
            if (casper.crawledPages < maxThreadAge) {
                pool.release(casper);
            } else {
                pool.destroy(casper);
            }
            asyncCheckIn();
        });
    });
}, maxThreads);
q.push(tasks);

function runTask (task, casper, callback) {
    var info = {
        uri: task.uri,
        parent: task.parent
    };
    var taskStart = Date.now();
    casper.start();
    casper.userAgent(UserAgents['Google Chrome 32 (Mac)']);
    // casper.viewport(1024, 768);
    casper.open(task.uri, {
        method: 'get',
        headers: {}
    });
    casper.then(function (response) {
        // Specific Logic for tapping Varnish cache info
        var hits = response.headers.get('X-Cache-Hits') || 0;
        var cacheControl = response.headers.get('Cache-Control');
        var maxAge = cacheControl ? RX.getNum.exec(cacheControl) : '';
        var contentType = response.headers.get('Content-Type');
        maxAge = maxAge ? maxAge[0] : '';
        info.status = response.status;
        info.cache = response.headers.get('X-Cache');
        info.hits = hits;
        info.expires = prettyTime(maxAge);
        info.contentType = contentType;
    });
    casper.then(function () {
        if (info.status === 200 && RX.isHTML.test(info.contentType)) {
            var newLinks = gatherLinks(this, task);
            newLinks.forEach(function (uri, index) {
                q.push({
                    parent: task.uri,
                    uri: uri
                });
            });
            info.tasksAdded = newLinks.length;
        }
    });
    casper.then(function () {
        completed++;
        info.tasksRemaining = q.length();
        info.tasksCompleted = completed;
        info.timeTask = prettyTime((Date.now() - taskStart) / 1000);
        info.timeSoFar = prettyTime((Date.now() - start) / 1000);
        this.echo(JSON.stringify(info, null, '\t'));
    });
    casper.run(callback);
}

function prettyTime (num) {
    if (num < 0) return '0.' + (~~(num * 1000)) + 's';
    if (num < 60) return (~~num) + 's';
    if (num < 3600) return (~~(num / 60)) + 'm,' + (~~(num % 60)) + 's';
    return (~~(num / 3600)) + 'h,' + (~~((num % 3600) / 60)) + 'm';
}

// Get the links, and add them to the links array
// (It could be done all in one step, but it is intentionally splitted)
function gatherLinks (casper, task) {
    var found;
    try {
        found = casper.evaluate(searchLinks) || [];
    } catch (e) {
        return 0;
    }
    if (trimHashes) {
        found = found.map(trimHash);
    }
    if (stayInRange) {
        found = found.filter(inRange);
    }
    if (skipDupes) {
        found = _.difference(_.unique(found), links);
    }
    return found;
}

// Fetch all <a> elements from the page and return
// the ones which contains a href starting with 'http://'
function searchLinks() {
    return Array.prototype.map.call(
        document.querySelectorAll("a"),
        function(a) {
            return a.href;
        }
    );
}

// Just opens the page and prints the title
function start(link) {
    this.start(link, function() {
        this.echo('Page title: ' + this.getTitle());
    });
}

// Checks if the URL is on one of our base links
function inRange (url) {
    for (var i = 0, l = links.length; i < l; i++) {
        if (url.substr(0, links[i].length) === links[i]) {
            return true;
        }
    }
    return false;
}

// Removes hash's from URL's http://example.com/#faq-num-2
function trimHash (uri) {
    var indexOfHash = uri.indexOf('#');
    return (indexOfHash !== -1) ? uri.substring(0, indexOfHash) : uri;
}

