@ECHO OFF
set CASPER_PATH=%~dp0..
set CASPER_PATH=%CASPER_PATH:\=/%
set CASPER_BIN=%CASPER_PATH%/bin/
call phantomjs "%CASPER_BIN%bootstrap.js" --casper-path="%CASPER_PATH%" --cli %*
