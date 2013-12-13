// Handles deletion of entire files from database, tags etc from a file
// or deleting tags.

var UM = require('../main');
var argv = require('optimist');
var helpers = require('../util/helpers');
var _ = require('underscore');

module.exports = function(args) {

  var parsedArgs = argv(args.slice(1))
                      .boolean(['c', 'u', 'a'])
                      .argv;

  if (!helpers.validTagOrCommentRequestDelete(parsedArgs)) {
    return;
  }

  var tags = (parsedArgs.t ? _.uniq(helpers.convertToArray(parsedArgs.t)) : []);
  var comment = parsedArgs.c;
  var url = parsedArgs.u;
  var author = parsedArgs.a;
  var files = parsedArgs._;

  if (args.length === 1) {
    parsedArgs._.unshift('help', 'delete');
    this.argv(parsedArgs._);
    return;
  }

  helpers.dirtyCommand();

  // If we have files passed in. We need to check
  // if we are going to be deleting the file
  // or just comments/tags from it.
  if (helpers.hasAny(files)) {
    if (helpers.hasAny(tags) || comment || url || author) {
      UM.files.removeTagsAndCommentsFromFiles(files, tags, comment, url, author);
    } else {
      UM.files.deleteFiles(files);
    }
  } else {
    UM.files.removeTagsFromFilesWithThoseTags(tags);
    UM.tags.deleteTags(tags);
  }
};