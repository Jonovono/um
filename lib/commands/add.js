var UM = require('../main');
var argv = require('optimist');
var log = require('winston');
var helpers = require('../util/helpers');


module.exports = function(args) {
  var inputArgs = args.slice(1);
  var parsedArgs = argv.parse(inputArgs);

  var tags = (parsedArgs.t ? helpers.convertToArray(parsedArgs.t) : []);
  var comment = parsedArgs.c;
  var files = parsedArgs._;

  if (inputArgs.length <= 0) {
    parsedArgs._.unshift('help', 'add');
    this.argv(parsedArgs._);
    return;
  }

  // If files were passed we can immediately add them.
  // as well as add any tags that were given to those files.
  if (helpers.hasAny(files)) {
    UM.tags.addTags(tags);
    UM.files.addFiles(files, tags, comment);
    // If no files passed we just add tags to the database.
  } else if (helpers.hasAny(tags)) {
      UM.emit('info', 'We will be creating tags, but not add to any file.');
      UM.tags.addTags(tags);
    }
};