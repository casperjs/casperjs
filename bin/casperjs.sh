#!/usr/bin/env bash

PHANTOMJS_NATIVE_ARGS=(
    'cookies-file'
    'config'
    'debug'
    'disk-cache'
    'ignore-ssl-errors'
    'load-images'
    'load-plugins'
    'local-storage-path'
    'local-storage-quota'
    'local-to-remote-url-access'
    'max-disk-cache-size'
    'output-encoding'
    'proxy'
    'proxy-auth'
    'proxy-type'
    'remote-debugger-port'
    'remote-debugger-autorun'
    'script-encoding'
    'web-security'
)

CASPER_PATH=$(cd $(dirname $(realpath $0))/.. && pwd)
CASPER_ARGS=''
PHANTOMJS_ARGS=''
CASPER_COMMAND=''

for arg in $@; do
  found="No"
  for i in $(seq 0 $((${#PHANTOMJS_NATIVE_ARGS[@]} - 1))); do
    if [[ $arg == --${PHANTOMJS_NATIVE_ARGS[$i]}* ]]; then
      PHANTOMJS_ARGS="$PHANTOMJS_ARGS $arg"
      found="Yes"
    fi
  done
  if [[ $found == "No" ]]; then
    CASPER_ARGS="$CASPER_ARGS $arg"
  fi
done

if [[ -n $PHANTOMJS_EXECUTABLE ]]; then
  CASPER_COMMAND=$PHANTOMJS_EXECUTABLE
else
  CASPER_COMMAND='phantomjs'
fi

$CASPER_COMMAND $PHANTOMJS_ARGS $CASPER_PATH/bin/bootstrap.js --casper-path=$CASPER_PATH --cli $CASPER_ARGS
