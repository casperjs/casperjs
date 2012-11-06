@ECHO OFF
@setlocal EnableDelayedExpansion
set CASPER_PATH=%~dp0..
set CASPER_BIN=%CASPER_PATH%\bin\

set PHANTOMJS_NATIVE_ARGS=(--cookies-file --config --debug --disk-cache --ignore-ssl-errors --load-images --load-plugins --local-storage-path --local-storage-quota --local-to-remote-url-access --max-disk-cache-size --output-encoding --proxy --proxy-auth --proxy-type --remote-debugger-port --remote-debugger-autorun --script-encoding --web-security)

set PHANTOM_ARGS=
set CASPER_ARGS=

set ARGV=%*
for %%a in ("%ARGV: =" "%") do (
	set IS_PHANTOM_ARG=0
	set arg=%%~a
	for %%i in %PHANTOMJS_NATIVE_ARGS% do (
		for %%x in (!arg!) do (
			if "%%x"=="%%i" (
				set IS_PHANTOM_ARG=1
				goto :EndOfCheck
			)
		)
	)
	:EndOfCheck
	if !IS_PHANTOM_ARG!==0 set CASPER_ARGS=!CASPER_ARGS! !arg!
	if !IS_PHANTOM_ARG!==1 set PHANTOM_ARGS=!PHANTOM_ARGS! !arg!
)

call phantomjs%PHANTOM_ARGS% "%CASPER_BIN%bootstrap.js" --casper-path="%CASPER_PATH%" --cli%CASPER_ARGS%