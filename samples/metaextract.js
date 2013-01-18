/*jshint strict:false*/
/*global kasperError console phantom require*/

var kasper = require("kasper").create();
var url = kasper.cli.get(0);
var metas = [];

if (!url) {
    kasper
        .echo("Usage: $ kasperjs metaextract.js <url>")
        .exit(1)
    ;
}

kasper.start(url, function() {
    metas = this.evaluate(function() {
        var metas = [];
        [].forEach.call(document.querySelectorAll("meta"), function(elem) {
            var meta = {};
            [].slice.call(elem.attributes).forEach(function(attr) {
                meta[attr.name] = attr.value;
            });
            metas.push(meta);
        });
        return metas;
    });
});

kasper.run(function() {
    require("utils").dump(metas);
    this.exit();
});
