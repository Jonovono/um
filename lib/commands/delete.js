var UM = require('../main');
var argv = require('optimist');
var helpers = require('../util/helpers');
var _ = require('underscore');
var log = require('winston');

module.exports = function(args) {

  var parsedArgs = argv(args.slice(1))
                      .boolean(['c'])
                      .argv;

  if (!helpers.validTagOrCommentRequestDelete(parsedArgs)) {
    return;
  }

  var tags = (parsedArgs.t ? _.uniq(helpers.convertToArray(parsedArgs.t)) : []);
  var comment = parsedArgs.c;
  var files = parsedArgs._;

  if (args.length === 1) {
    parsedArgs._.unshift('help', 'delete');
    this.argv(parsedArgs._);
    return;
  }

  // If we have files passed in. We need to check
  // if we are going to be deleting the file
  // or just comments/tags from it.
  if (helpers.hasAny(files)) {
    if (helpers.hasAny(tags) || comment) {
      UM.files.removeTagsAndCommentsFromFiles(files, tags, comment);
    } else {
      UM.files.deleteFiles(files);
    }
  } else {
    UM.files.removeTagsFromFilesWithThoseTags(tags);
    UM.tags.deleteTags(tags);
  }
}