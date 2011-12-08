phantom.injectJs('casper.js');

var casper = new phantom.Casper({
    onResourceReceived: function(self, resource) {
        var infos = [
            resource.url,
            resource.status,
            resource.statusText,
            resource.redirectURL,
            resource.bodySize
        ];
        resource.headers.forEach(function(header) {
            infos.push('[' + [header.name, header.value].join(', ') + ']');
        });
        self.log(infos.join(', '), 'verbose');
    },
    verbose: true,
    logLevel: 'verbose'
});

casper.logLevels = ['verbose'].concat(casper.logLevels);

casper.start('http://www.google.com/').run(function(self) {
    self.exit();
});
