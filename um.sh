#!/bin/bash

function um()  {
	node bin/umm $@
	. ~/Life/Code/Projects/um/doc/into.sh
	cat /dev/null > ~/Life/Code/Projects/um/doc/into.sh
}

if [ "$BASH_SOURCE" != "$0" ]; then
	:
else 
	um
fi

