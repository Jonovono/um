// Responsible for adding new files to the database //
// UM add <file> [<file2>...] -t tag -c comment -u url -a author -w workspace

var UM = require('../main');
var argv = require('optimist');
var helpers = require('../util/helpers');

module.exports = function(args) {
  var inputArgs = args.slice(1);              // Commands in an array
  var parsedArgs = argv.parse(inputArgs);     // Parse them using optimist.

  // Get the tags, comments, files
  var tags = (parsedArgs.t ? helpers.convertToArray(parsedArgs.t) : []);
  var workspaces = (parsedArgs.w ? helpers.convertToArray(parsedArgs.w) : []);
  var comment = parsedArgs.c;
  var url = parsedArgs.u;
  var author = parsedArgs.a;
  var files = parsedArgs._;

  // If entered only `um add` show the help
  if (inputArgs.length <= 0 || !helpers.hasAny(files)) {
    parsedArgs._.unshift('help', 'add');
    this.argv(parsedArgs._);
    return;
  }

  helpers.dirtyCommand();

  // If files were passed we can immediately add them.
  // as well as add any tags that were given to those files.
  UM.tags.addTags(tags, true);
  UM.workspaces.addWorkspaces(workspaces);
  UM.files.addFiles(files, tags, comment, url, author);
  UM.workspaces.addFilesToWorkspaces(workspaces, files);
};