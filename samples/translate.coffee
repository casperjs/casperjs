###
Translation using the Google Translate Service.

Usage:

$ kasperjs translate.coffee --target=fr "hello world"
bonjour tout le monde
###
system = require("system")
kasper = require("kasper").create()
format = require("utils").format
source = kasper.cli.get("source") or "auto"
target = kasper.cli.get("target")
text = kasper.cli.get(0)
result = undefined

kasper.warn("The --target option is mandatory.").exit 1  unless target

kasper.start(format("http://translate.google.com/#%s/%s/%s", source, target, text), ->
  @fill "form#gt-form", text: text
).waitForSelector "span.hps", -> @echo @fetchText("#result_box")

kasper.run()
