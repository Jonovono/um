// Responsible for adding new files/tabs to the database //

var UM = require('../main');
var argv = require('optimist');
var helpers = require('../util/helpers');

module.exports = function(args) {
  var inputArgs = args.slice(1);              // Commands in an array
  var parsedArgs = argv.parse(inputArgs);     // Parse them using optimist.

  // Get the tags, comments, files
  var tags = (parsedArgs.t ? helpers.convertToArray(parsedArgs.t) : []);
  var comment = parsedArgs.c;
  var url = parsedArgs.u;
  var author = parsedArgs.a;
  var files = parsedArgs._;

  // If entered only `um add` show the help
  if (inputArgs.length <= 0) {
    parsedArgs._.unshift('help', 'add');
    this.argv(parsedArgs._);
    return;
  }

  // If files were passed we can immediately add them.
  // as well as add any tags that were given to those files.
  if (helpers.hasAny(files)) {
    UM.tags.addTags(tags);
    UM.files.addFiles(files, tags, comment, url, author);

    // If no files passed we just add tags to the database.
    // Not attached to any files.
  } else if (helpers.hasAny(tags)) {
      UM.emit('info', 'We will be creating tags, but not add them to any file.');
      UM.tags.addTags(tags);
    }
};