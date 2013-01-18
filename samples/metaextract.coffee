kasper = require("kasper").create()
url = kasper.cli.get 0
metas = []

if not url
    kasper
        .echo("Usage: $ kasperjs metaextract.coffee <url>")
        .exit 1

kasper.start url, ->
    metas = @evaluate ->
        metas = []
        castarray = (arr) -> [].slice.call(arr)
        for elem in castarray document.querySelectorAll "meta"
            meta = {}
            for attr in castarray elem.attributes
                meta[attr.name] = attr.value
            metas.push meta
        metas

kasper.run ->
    require("utils").dump metas
    this.exit()
