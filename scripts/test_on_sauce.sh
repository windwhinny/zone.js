#! /bin/bash
SCRIPT_DIR=$(dirname $0)
cd $SCRIPT_DIR/..

SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

function killServer {
  kill $serverPid
}

node test/ws-server.js &
serverPid=$!

trap killServer EXIT

karma start --sauce &
wait %2
