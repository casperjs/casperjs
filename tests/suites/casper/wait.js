/*eslint strict:0*/
casper.test.begin('wait() tests', 1, function(test) {
    var waitStart;

    casper.start('tests/site/index.html', function() {
        waitStart = new Date().getTime();
    });

    casper.wait(250, function() {
        test.assert(new Date().getTime() - waitStart > 250,
            'Casper.wait() can wait for a given amount of time');
    });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('waitFor() tests', 4, function(test) {
    casper.start('tests/site/waitFor.html');

    casper.waitFor(function() {
        return this.evaluate(function() {
            return document.querySelectorAll('li').length === 4;
        });
    }, function() {
        test.pass('Casper.waitFor() can wait for something to happen');
    }, function() {
        test.fail('Casper.waitFor() can wait for something to happen');
    });

    casper.reload().waitFor(function(){
        return false;
    }, function() {
        test.fail('waitFor() processes onTimeout callback');
    }, function() {
        test.pass('waitFor() processes onTimeout callback');
    }, 1000);
    
    casper.reload().waitFor(function(){
        return true;
    }, function() {
        test.pass('waitFor() can run test function when timeout is set to 1');
    }, function() {
        test.fail('waitFor() can not run test function when timeout is set to 1');
    }, 1);
    
    var testArray = [false,true];
    var i = 0;
    casper.reload().waitFor(function(){
        return testArray[i++];
    }, function() {
        test.pass('waitFor() can run a last test function after timeout');
    }, function() {
        test.fail('waitFor() can not run a last test function after timeout');
    }, (1.5*casper.options.retryTimeout));
    
    casper.run(function() {
        test.done();
    });
});

casper.test.begin('waitForResource() tests', 2, function(test) {
    casper.start('tests/site/waitFor.html');

    casper.waitForResource('phantom.png', function() {
        test.pass('Casper.waitForResource() waits for a resource');
    }, function() {
        test.fail('Casper.waitForResource() waits for a resource');
    });

    casper.reload().waitForResource(/phantom\.png$/, function() {
        test.pass('Casper.waitForResource() waits for a resource using RegExp');
    }, function() {
        test.fail('Casper.waitForResource() waits for a resource using RegExp');
    });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('waitForSelector() tests', 1, function(test) {
    casper.start('tests/site/waitFor.html');

    casper.waitForSelector('li:nth-child(4)', function() {
        test.pass('Casper.waitForSelector() waits for a selector to exist');
    }, function() {
        test.fail('Casper.waitForSelector() waits for a selector to exist');
    });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('waitForText() tests', 3, function(test) {
    casper.start('tests/site/waitFor.html');

    casper.waitForText('<li>four</li>', function() {
        test.pass('Casper.waitForText() can wait for text');
    }, function() {
        test.fail('Casper.waitForText() can wait for text');
    });

    casper.reload().waitForText(/four/i, function() {
        test.pass('Casper.waitForText() can wait for regexp');
    }, function() {
        test.fail('Casper.waitForText() can wait for regexp');
    });

    casper.reload().waitForText('Voilà', function() {
        test.pass('Casper.waitForText() can wait for decoded HTML text');
    }, function() {
        test.fail('Casper.waitForText() can wait for decoded HTML text');
    }, 1000);

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('waitForSelectorTextChange() tests', 1, function(test) {
    casper.start('tests/site/waitFor.html');

    casper.waitForSelectorTextChange('#textChange', function() {
        test.pass('Casper.waitForSelectorTextChange() can wait for text on a selector to change');
    }, function() {
        test.fail('Casper.waitForSelectorTextChange() can wait for text on a selector to change');
    });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('waitUntilVisible() tests', 2, function(test) {
    casper.start('tests/site/waitFor.html');

    casper.waitUntilVisible('li:nth-child(4)', function() {
        test.pass('Casper.waitUntilVisible() waits for a selector being visible');
    }, function() {
        test.fail('Casper.waitUntilVisible() waits for a selector being visible');
    });

    casper.waitUntilVisible('p', function() {
        test.pass('Casper.waitUntilVisible() waits for a selector being visible');
    }, function() {
        test.fail('Casper.waitUntilVisible() waits for a selector being visible');
    });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('waitForUrl() regexp tests', 1, function(test) {
    casper.start().thenEvaluate(function() {
        setTimeout(function() {
            document.location = './form.html';
        }, 100);
    });

    casper.waitForUrl(/form\.html$/, function() {
        test.pass('Casper.waitForUrl() waits for a given regexp url');
    });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('waitForUrl() string tests', 1, function(test) {
    casper.start().thenEvaluate(function() {
        setTimeout(function() {
            document.location = './form.html';
        }, 100);
    });

    casper.waitForUrl('form.html', function() {
        test.pass('Casper.waitForUrl() waits for a given string url');
    });

    casper.run(function() {
        test.done();
    });
});

casper.test.begin('waitForExec() tests', 24, function(test) {
    if (phantom.casperEngine === 'slimerjs') {
        test.skip(24, 'SlimerJS DOES NOT HAVE A child_process MODULE');  
    } else {    
        var system = require('system');
        var fs = require('fs');
        var lsExecutable;
        var shExecutable;
        if (system.os.name != "windows") {
            // Seems to be crashing here in slimerJs 0.10.x, added fs.exists before fs.isExecutable for testing
            lsExecutable = system.env.PATH.split(':').filter(function (path) {
                var fileString = path + fs.separator + 'ls';
                return (fs.exists(fileString) && fs.isExecutable(fileString));
            })[0] + fs.separator + 'ls';
            shExecutable = system.env.PATH.split(':').filter(function (path) {
                var fileString = path + fs.separator + 'sh';
                return (fs.exists(fileString) && fs.isExecutable(fileString));
            })[0] + fs.separator + 'sh';
        };
        var notExecutable = '';
        var k = 0;
        while (!notExecutable) {
            notExecutable = (!fs.exists(fs.workingDirectory + fs.separator + 'run' + k + '.exe')) ? fs.workingDirectory + fs.separator + 'run' + k + '.exe' : '';
            k++;
        };
        
        casper.start('');

        casper.waitForExec(null, [],
            // Add success1 because on some systems the default system shell maybe exits by itself after being called(?)
            null,
            /*
            function success1(details) {
                test.assert((utils.isObject(details.data.command) && utils.isString(details.data.command.program) && utils.isArray(details.data.command.parameters)), 'Casper.waitForExec() can call the default system shell and it exits before timeout: "' + JSON.stringify(details.data.command) + '"');
                test.assertEquals(details.data.isChildNotFinished, 0,'Default system shell returned "isChildNotFinished" 0 before timeout');
                test.assert(utils.isNumber(details.data.exitCode), 'Default system shell "' + JSON.stringify(details.data.command) + '" exited before timeout with exit code ' + details.data.exitCode);
                
            },
            */
            function timeout1(timeout, details) {
                // exit code value seems to be 0 when phantom kills the process before 2.1.1(?)
                var valueOfExitCode = (utils.matchEngine({name: 'phantomjs', version: {min: '1.9.0', max: '2.1.0'}})) ? 0 : 15;
                test.assert((utils.isString(details.data.command) && utils.isArray(details.data.parameters)), 'Casper.waitForExec() can call the default system shell and kills it on timeout: ' + JSON.stringify(details.data));
                test.assert( (utils.isNumber(details.data.pid) && ( details.data.pid > 0) ), 'Default system shell exited on timeout (TERM signal) and used PID ' + details.data.pid);
                test.assertEquals(details.data.isChildNotFinished, 0,'Default system shell returned "isChildNotFinished" 0 on timeout');
                test.assertEquals(details.data.exitCode, valueOfExitCode, 'Default system shell exited on timeout (TERM signal) with exit code ' + details.data.exitCode);
              
        }, 2000);

        casper.reload().waitForExec(notExecutable, [],
            function success2(details) {
                test.assert((utils.isString(details.data.command) && utils.isArray(details.data.parameters)), 'Casper.waitForExec() tried to call non existing executable: ' + JSON.stringify(details.data));
                test.assertEquals(details.data.pid, 0,'Non existing executable returned "pid" 0');
                test.assertEquals(details.data.isChildNotFinished, 0,'Non existing executable returned "isChildNotFinished" 0');
                test.assertEquals(details.data.exitCode, null, 'Non existing executable returned exitCode null');
                test.assertEquals(details.data.elapsedTime, null, 'Non existing executable returned elapsedTime null');
        });

        if (system.os.name != "windows") {
            if (lsExecutable) {

                casper.reload().waitForExec(lsExecutable, ['-a',fs.workingDirectory],
                    function success3(details) {
                        test.assert((utils.isString(details.data.command) && utils.isArray(details.data.parameters)), 'Casper.waitForExec() can call "lsExecutable" on "workingDirectory": ' + JSON.stringify(details.data));
                        test.assert( (utils.isNumber(details.data.pid) && ( details.data.pid > 0) ), '"lsExecutable" on "workingDirectory" used PID ' + details.data.pid);
                        test.assertEquals(details.data.isChildNotFinished, 0,'"lsExecutable" on "workingDirectory" returned "isChildNotFinished" 0');
                        test.assertEquals(details.data.exitCode, 0, '"lsExecutable" on "workingDirectory" returned exitCode 0');
                        test.assertTruthy(details.data.stdout, '"lsExecutable" on "workingDirectory" returned stdout ' + JSON.stringify(details.data.stdout));
                });

                casper.reload().waitForExec(lsExecutable, [notExecutable],
                    function success4(details) {
                        test.assert((utils.isString(details.data.command) && utils.isArray(details.data.parameters)), 'Casper.waitForExec() can call "lsExecutable" on "notExecutable": ' + JSON.stringify(details.data));
                        test.assert( (utils.isNumber(details.data.pid) && ( details.data.pid > 0) ), '"lsExecutable" on "notExecutable" used PID ' + details.data.pid);
                        test.assertEquals(details.data.isChildNotFinished, 0,'"lsExecutable" on "notExecutable" returned "isChildNotFinished" 0');
                        test.assertTruthy(details.data.exitCode, '"lsExecutable" on "notExecutable" returned exitCode ' + details.data.exitCode);
                        test.assertTruthy(details.data.stderr, '"lsExecutable" on "notExecutable" returned stderr ' + JSON.stringify(details.data.stderr));
                });

            } else {
                casper.reload().then( function() {
                    test.skip(10, 'ls EXECUTABLE NOT FOUND');  
                });
            };

            if (shExecutable) {
                // vars used to measure if 'shell script to trap TERM signal' is waiting enough and being killed faster enough
                var shellTrapTimeout = 500;
                var shellTrapTermTimeout = 1000;
                var timeLapseAfterKillSignal = 300;
                var minTimeLapse = shellTrapTimeout + shellTrapTermTimeout;
                var maxTimeLapse = minTimeLapse + timeLapseAfterKillSignal;
                casper.then( function() { // inside then for elapsedTime don't be added with other tests elapsedTime
                    // on my tests 'TERM trapped!' will not be on stdout because 'shExecutable' is killed with SIGKILL
                    casper.reload().waitForExec(shExecutable + ' -c', ['trap "echo TERM trapped!" TERM ; sleep 60'], null,
                        function timeout5(timeout,details) {
                            // exit code value seems to be 0 when phantom kills the process before 2.1.1(?)
                            var valueOfExitCode = (utils.matchEngine({name: 'phantomjs', version: {min: '1.9.0', max: '2.1.0'}})) ? 0 : 9;
                            test.assert((utils.isString(details.data.command) && utils.isArray(details.data.parameters)), 'Casper.waitForExec() can call shell script to trap TERM signal and then kills it: ' + JSON.stringify(details.data));
                            test.assert( (utils.isNumber(details.data.pid) && ( details.data.pid > 0) ), 'shell script to trap TERM signal used PID ' + details.data.pid);
                            test.assertEquals(details.data.isChildNotFinished, 0, 'shell script to trap TERM signal returned "isChildNotFinished" 0');
                            test.assertEquals(details.data.exitCode, valueOfExitCode, 'shell script to trap TERM signal returned exitCode ' + details.data.exitCode);
                            // test if it first waited for shellTrapTimeout ms, then waited for shellTrapTermTimeout ms after TERM signal, then exited faster (timeLapseAfterKillSignal ms or less) with KILL signal
                            test.assert( (utils.isNumber(details.data.elapsedTime) && (details.data.elapsedTime <= maxTimeLapse) && (details.data.elapsedTime > minTimeLapse) ), 'shell script to trap TERM signal run and killed in more than ' + minTimeLapse + 'ms and in less than or equal to ' + maxTimeLapse + 'ms: ' + details.data.elapsedTime);
                    }, [shellTrapTimeout, shellTrapTermTimeout]);
                });
                
            } else {
                casper.reload().then( function() {
                    test.skip(5, 'sh EXECUTABLE NOT FOUND');  
                });
            };
            
        } else {
            
            casper.reload().waitForExec(null, ['/c', 'dir', fs.workingDirectory],
                function(details) {
                        test.assert((utils.isString(details.data.command) && utils.isArray(details.data.parameters)), 'Casper.waitForExec() can call dir on "workingDirectory": ' + JSON.stringify(details.data));
                        test.assert( (utils.isNumber(details.data.pid) && ( details.data.pid > 0) ), 'dir on "workingDirectory" used PID ' + details.data.pid);
                        test.assertEquals(details.data.isChildNotFinished, 0,'dir on "workingDirectory" returned "isChildNotFinished" 0');
                        test.assertEquals(details.data.exitCode, 0, 'dir on "workingDirectory" returned exitCode 0');
                        test.assertTruthy(details.data.stdout, 'dir on "workingDirectory" returned stdout ' + JSON.stringify(details.data.stdout));
            });

            casper.reload().waitForExec(null, ['/c', 'dir', notExecutable],
                function(details) {
                    test.assert((utils.isString(details.data.command) && utils.isArray(details.data.parameters)), 'Casper.waitForExec() can dir on "notExecutable": ' + JSON.stringify(details.data));
                    test.assert( (utils.isNumber(details.data.pid) && ( details.data.pid > 0) ), 'dir on "notExecutable" used PID ' + details.data.pid);
                    test.assertEquals(details.data.isChildNotFinished, 0, 'dir on "notExecutable" returned "isChildNotFinished" 0');
                    test.assertTruthy(details.data.exitCode, 'dir on "notExecutable" returned exitCode ' + details.data.exitCode);
                    test.assertTruthy(details.data.stderr, 'dir on "notExecutable" returned stderr ' + JSON.stringify(details.data.stderr));
            });
            
            casper.reload().then( function() {
                test.skip(5, 'WINDOWS SYSTEM, CAN NOT EASILY TRAP TERM SIGNAL ON SHELL SCRIPT');  
            });
            
        };

    };

    casper.run(function() {
        test.done();
    });
});
