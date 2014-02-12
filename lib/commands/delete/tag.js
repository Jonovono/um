// Responsible for deleting tags //
// UM delete tag <tag1> [<tag2>...]

var UM = require('../../main');
var argv = require('optimist');
var helpers = require('../../util/helpers');

module.exports = function(args) {
  var inputArgs = args.slice(2);              // Commands in an array
  var tags = inputArgs;
  var parsedArgs = argv.parse(inputArgs);     // Parse them using optimist.


  // If entered only `um delete` show the help
  if (inputArgs.length <= 0) {
    parsedArgs._.unshift('help', 'delete', 'tag');
    this.argv(parsedArgs._);
    return;
  }

  helpers.dirtyCommand();

  // First we remove the tags from files that have those tags
  UM.files.removeTagsFromFilesWithThoseTags(tags);
  UM.workspaces.removeTagsFromWorkspacesWithThoseTags(tags);
  UM.tags.deleteTags(tags);
};