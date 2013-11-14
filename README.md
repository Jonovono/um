# UM: Do more in the terminal.

Awhile ago I created a project that I called c that allowed you to add comments to files/folders in the terminal. That project is [here](https://github.com/Jonovono/c). After that I put together a pretty scrubbed together version that allowed me to add tags as well, and was more clean. This project is the result of cleaning that up. I figured it was a good time now because with the new Mavericks release enabling tagging, I am not sure how/if I want to somehow have them work together. So that the tags from UM also create tags on the Mac. 



## About

So UM is what I use to be more productive in the terminal. I have a bunch more features I want to add to it, but right now it's mainly a way to organize your code on your system by giving projects comments or tags. You can then easily:

* See all files with certain tags
* See a files tags + comments
* Add tags/comments to projects
* cd into or open the project
* Merge tags together


## A WORD OF CAUTION
UM is pretty `forceful`. Before using you may want to try it out on files that their location does not matter. It's currently made specifically for me, but I thought others may find it useful. **BUT BEFORE USING PLEASE READ:**

* When you `ADD` files with UM it moves the entire file/folder to the UM sourced directory. WHY? See below. (When you delete files from UM it moves them back to the original location from where you added them.)
* If you want to use UM's `INTO` functionality, be warned that it does [somethings that may not be safe](http://stackoverflow.com/questions/13753157/bash-script-to-change-parent-shell-directory). However, UM may still be useful if you don't want to use that, and it's easy to opt out.


alias um='nocorrect um';