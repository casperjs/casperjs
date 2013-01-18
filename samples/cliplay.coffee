kasper = require("kasper").create()
dump = require("utils").dump

# removing default options passed by the Python executable
kasper.cli.drop "cli"
kasper.cli.drop "kasper-path"

if kasper.cli.args.length is 0 and Object.keys(kasper.cli.options).length is 0
    kasper
        .echo("Pass some args and options to see how they are handled by kasperJS")
        .exit(1)

kasper.echo "kasper CLI passed args:"
dump kasper.cli.args

kasper.echo "kasper CLI passed options:"
dump kasper.cli.options

kasper.exit()
