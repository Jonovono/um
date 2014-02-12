// Responsible for adding new tags to the database //
// UM add tag <tag1> [<tag2>..] -f f1 -f f2 -w workspace(Files for now should be in the database.)

var UM = require('../../main');
var argv = require('optimist');
var helpers = require('../../util/helpers');
var log = require('winston');

module.exports = function(args) {
  var inputArgs = args.slice(2);              // Commands in an array
  var parsedArgs = argv.parse(inputArgs);     // Parse them using optimist.
  var tags = parsedArgs._;
  var files = (parsedArgs.f ? helpers.convertToArray(parsedArgs.f) : []);
  var workspaces = (parsedArgs.w ? helpers.convertToArray(parsedArgs.w) : []);

  // If entered only `um add` show the help
  if (inputArgs.length <= 0) {
    parsedArgs._.unshift('help', 'add', 'tag');
    this.argv(parsedArgs._);
    return;
  }

  if (!tags || tags.length === 0) {
    log.error('You need to enter atleast one tag.');
    return;
  }

  // Command alters the file system
  helpers.dirtyCommand();

  UM.tags.addTags(tags, true);
  UM.files.updateFiles(files, tags);
  UM.workspace.addWorkspaces(workspaces);
  UM.workspaces.addTagsToWorkspaces(workspaces, tags);
};