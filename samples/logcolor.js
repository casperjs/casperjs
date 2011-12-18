if (!phantom.casperLoaded) {
    console.log('This script is intended to work with CasperJS, using its executable.');
    phantom.exit(1);
}

var casper = new phantom.Casper({
    verbose: true,
    logLevel: 'debug'
});

casper.log('this is a debug message', 'debug');
casper.log('and an informative one', 'info');
casper.log('and a warning', 'warning');
casper.log('and an error', 'error');
casper.exit();
