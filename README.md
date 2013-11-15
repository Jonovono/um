# UM: Do more in the terminal.

Awhile ago I created a project that I called c that allowed you to add comments to files/folders in the terminal. That project is [here](https://github.com/Jonovono/c). 

After that I put together a pretty scrubbed together version that allowed me to add tags as well, and was more clean. This project is the result of cleaning that up. I figured it was a good time now because with the new Mavericks release enabling tagging, I am not sure how/if I want to somehow have them work together. So that the tags from UM also create tags on the Mac. I don't currenty have a way to transfer your tags from c to UM.



## About

So UM is what I use to `be more productive in the terminal`. I have a bunch more features I want to add to it, but right now it's mainly a way to organize your code on your system by giving projects comments or tags. You can then easily:

* See all files with certain tags
* See a files tags + comments
* Add tags/comments to projects
* cd into or open the project
* Merge tags together

### Why UM?

Went through a few name changes, but settled on this for no particular reason besides liking it the most and semi-connected: When in the terminal you may think `UM I want that file I was working on last week that was a simple music site, where did I store it!?!?` UM helps refresh your memory.



## A WORD OF CAUTION
UM is pretty `forceful`. Before using you may want to try it out on files that their location does not matter. It's currently made specifically for me, but I thought others may find it useful. **BUT BEFORE USING PLEASE READ:**

* When you `ADD` files with UM it moves the entire file/folder to the UM sourced directory. WHY? See below. (When you delete files from UM it moves them back to the original location from where you added them.)
* If you want to use UM's `INTO` functionality, be warned that it does [somethings that may not be safe](http://stackoverflow.com/questions/13753157/bash-script-to-change-parent-shell-directory). However, UM may still be useful if you don't want to use that, and it's easy to opt out.
* It uses a fair amount of NPM modules which may, or may not, be a problem for you.

If these are not things you'd like, or like the idea of the project but would like to use it in a different way, let me know I can help you customize it!

## Installation


## Extra Features

### CDing around

### Tab Autocompletion


alias um='nocorrect um';