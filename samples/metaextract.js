var casper = require("casper").create()
  , url = casper.cli.get(0)
  , metas = [];

if (!url) {
    casper.echo('Usage: casperjs [url]').exit();
}

casper.start(url, function() {
    metas = this.evaluate(function() {
        var metas = [];
        [].forEach.call(document.querySelectorAll('meta'), function(elem) {
            var meta = {};
            [].slice.call(elem.attributes).forEach(function(attr) {
                meta[attr.name] = attr.value;
            });
            metas.push(meta);
        });
        return metas;
    });
});

casper.run(function() {
    require("utils").dump(metas);
    this.exit();
});
