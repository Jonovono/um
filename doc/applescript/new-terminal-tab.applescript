on run arg

set p to arg's first item
set g to "cd " & p & "; clear; pwd"

	tell application "iTerm"
	    make new terminal
	    tell the current terminal
	        activate current session
	        launch session "Default Session"
	        tell the last session to write text g
	    end tell
	end tell
end run