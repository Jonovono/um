#!/bin/bash

UM_DIR=~/um
UM_INTO_FILE=$UM_DIR/.sh/into.sh

function um()  {
	umm $@
	. $UM_INTO_FILE
	cat /dev/null > $UM_INTO_FILE
}

if [ "$BASH_SOURCE" != "$0" ]; then
	:
else 
	um $@
fi