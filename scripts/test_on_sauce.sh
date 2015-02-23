#! /bin/bash
SCRIPT_DIR=$(dirname $0)
cd $SCRIPT_DIR/..

SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

karma start --sauce
