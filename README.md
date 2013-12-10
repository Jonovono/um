# UM: Do more in the terminal.

Awhile ago I created a project that I called c that allowed you to add comments to files/folders in the terminal. That project is [here](https://github.com/Jonovono/c). 

After that I put together a pretty scrubbed together version that allowed me to add tags as well, and was more clean. This project is the result of cleaning that up. I figured it was a good time now because with the new Mavericks release enabling tagging, I am not sure how/if I want to somehow have them work together. So that the tags from UM also create tags on the Mac. I don't currenty have a way to transfer your tags from c to UM.

** WHEN YOU ADD PROJECTS WITH UM IT MOVES THE DIRECTORY **

## About

So UM is what I use to `be more productive in the terminal`. I have a bunch more features I want to add to it, but right now it's mainly a way to organize your code on your system by giving projects comments or tags. You can then easily:

* See all files with certain tags
* See a files tags + comments + url + author
* Add tags/comments (and a url/author) to projects
* cd into or open the project
* Merge tags together
* Open the project in Sublime Text (default editor later).

### Why UM?

Went through a few name changes, but settled on this for no particular reason besides liking it the most and semi-connected: When in the terminal you may think `UM I want that file I was working on last week that was a simple music site, where did I store it!?!?` UM helps refresh your memory.

### Why did I make UM?

## A WORD OF CAUTION
UM is pretty `forceful`. Before using you may want to try it out on files that their location does not matter. It's currently made specifically for me, but I thought others may find it useful. **BUT BEFORE USING PLEASE READ:**

* When you `ADD` files with UM it moves the entire file/folder to the UM sourced directory. WHY? See below. (When you delete files from UM it moves them back to the original location from where you added them.)
* If you want to use UM's `INTO` functionality, be warned that it does [somethings that may not be safe](http://stackoverflow.com/questions/13753157/bash-script-to-change-parent-shell-directory). However, UM may still be useful if you don't want to use that, and it's easy to opt out.
* It uses a fair amount of NPM modules which may, or may not, be a problem for you.
* Do not delete the main UM directory. Since all your code, tags, etc are stored here all that would be lost. I will make an easy way to backup to Dropbox. 

If these are not things you'd like, or you like the idea of the project but would like to use it in a different way, let me know I can help you customize it!

## Installation


## Extra Features

### CDing around

### Tab Autocompletion

## In the Future

Some things I want to add in the next coming while are:

* Something like z (previously jump). So it can keep track of common ones and you can easily cd around those
* A `HISTORY` command. 
* A `UNDO` command to easily undo things you just did.
* An `ALIAS` command, *maybe*, to give command files/folders an easy name to remember. Or basically a way to, when you add a file to the system, be able to give it an alternate name.
* Longer comments. Have the ability to display the README.md if no comment is there, and also open a text editor to edit a longer form of a comment.
* A `FORMULA` command. This will be cool! Allow the ability to define common 'formulas'. So for example, I'd open a text file and make a formula like:

```
dir1
grunt watch

dir1
node index.js

.
mongod
```
Then I can run `um formula formulaname`, and it will execute these commands and open tabs for each.

* Use the output of previous command in current command. So for example. You'd run `um files`. The files would have numbers besides them. Then you could do `um into 3` to go into the third one.
* Integrations with Alfred!
* Make it more efficient. I am sure it could be made to run quicker. Maybe when first starts get all the files/tags so it does not have to repeatedly look them up?
* ADD TESTS!
* Can you think of anything else that would be cool? Shoot me a message!


#### You may have to:

alias um='nocorrect um'

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/Jonovono/um/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

