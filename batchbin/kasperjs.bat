@ECHO OFF
set kasper_PATH=%~dp0..
set kasper_BIN=%kasper_PATH%\bin\
set ARGV=%*
call phantomjs "%kasper_BIN%bootstrap.js" --kasper-path="%kasper_PATH%" --cli %ARGV%