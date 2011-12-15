/**
 * Phantom args parsing utilities.
 *
 */
(function(phantom) {
    phantom.Casper.Cli = function() {
        /**
         * Extract current named parameters passed to the phantom script through
         * the command line. Named arguments are of the form --foo=bar ou --foo
         *
         */
        this.named = phantom.args.forEach(function(arg) {
            if (arg.indexOf('--') === 0) {
                var match = /--(.*)=(.*)\s?/i.exec(arg);
                if (match) {
                    params[match[1]] = match[2];
                } else {
                    var match2 = /--(.*)\s?/i.exec(arg);
                    if (match2) {
                        params[match2[1]] = true;
                    }
                }
            }
        });

        /**
         * Checks that the specified named arguments have been passed to current
         * phantom script. Dies on failure by default, but you can provide an
         * onError callback for hooking on fail and do what you want.
         *
         */
        this.requireNamedArgs = function(list, onError) {
            var missing = [], params = phantom.extractNamedArgs();
            for (var i = 0; i < list.length; i++) {
                var name = list[i];
                if (!params.hasOwnProperty(name)) {
                    missing.push(name);
                }
            }
            if (missing.length > 0) {
                if (typeof(onError) === "function") {
                    onError(missing);
                } else {
                    var s = missing.length > 1 ? 'are' : 'is a';
                    console.log(JSON.stringify({
                        status: "error",
                        message: '"' + (missing.join('", "')) + '" ' + s + ' required named parameters.'
                    }, null, '  '));
                    phantom.exit(1);
                }
            }
        };
    };
})(phantom);
