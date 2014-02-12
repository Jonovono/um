// Responsible for updating attributes on the file
// Can update the tags, comment, url, author, workspace

// UM update <file> [<file2>...] -c comment -t tag -a author
//                               -u url -w workspace

var UM = require('../main');
var argv = require('optimist');
var helpers = require('../util/helpers');

module.exports = function(args) {
  var inputArgs = args.slice(1);              // Commands in an array
  var parsedArgs = argv.parse(inputArgs);     // Parse them using optimist.

  // Get the tags, comments, files
  var tags = (parsedArgs.t ? helpers.convertToArray(parsedArgs.t) : []);
  var comment = parsedArgs.c;
  var files = parsedArgs._;
  var url = parsedArgs.u;
  var author = parsedArgs.a;
  var workspaces = (parsedArgs.w ? helpers.convertToArray(parsedArgs.w) : []);

  // If entered only `um add` show the help
  if (inputArgs.length <= 0) {
    parsedArgs._.unshift('help', 'update');
    this.argv(parsedArgs._);
    return;
  }

  // If no files were passed, we can't do anything!
  if (!helpers.hasAny(files)) {
    UM.emit('error', 'The update command requires you enter at least ONE file.');
    return;
  }

  helpers.dirtyCommand();
  
  UM.tags.addTags(tags, false);
  UM.files.updateFiles(files, tags, comment, url, author);
  UM.workspaces.addWorkspaces(workspaces);
  UM.workspaces.addFilesToWorkspaces(workspaces, files);
};