// Responsible for deleting workspaces //
// UM delete tag <workspace> [-f file -t tag -d]

var UM = require('../../main');
var argv = require('optimist');
var helpers = require('../../util/helpers');
var _ = require('underscore');
var log = require('winston');

module.exports = function(args) {
  var inputArgs = args.slice(2);              // Commands in an array

  var parsedArgs = argv(inputArgs)
                      .boolean(['d'])
                      .argv;

  var tags = (parsedArgs.t ? _.uniq(helpers.convertToArray(parsedArgs.t)) : []);
  var files = (parsedArgs.f ? helpers.convertToArray(parsedArgs.f) : []);
  var workspace = parsedArgs._[0];
  var description = parsedArgs.d;


  // If entered only `um delete workspace` show the help
  if (inputArgs.length <= 0) {
    parsedArgs._.unshift('help', 'delete', 'workspace');
    this.argv(parsedArgs._);
    return;
  }

  if (!workspace) {
    log.error('You need to enter a workspace name.');
    return;
  }

  if (parsedArgs._.length > 1) {
    log.error('Only specify one workspace at a time.');
    return;
  }

  helpers.dirtyCommand();

  // Delete the workspaces

  if (helpers.hasAny(tags) || helpers.hasAny(files) || description) {
    UM.workspaces.removeFromWorkspace(workspace, tags, files, description);
  } else {
    UM.workspaces.deleteWorkspace(workspace);
  }
};