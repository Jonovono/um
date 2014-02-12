// Coming later. For now you can update it with the UM add workspace.
// Updates a files tags, comment, url, author
// UM update workspace <workspace> -t tag -f file -d description

var UM = require('../../main');
var argv = require('optimist');
var helpers = require('../../util/helpers');
var log = require('winston');

module.exports = function(args) {
  var inputArgs = args.slice(2);              // Commands in an array
  var parsedArgs = argv.parse(inputArgs);     // Parse them using optimist.

  // Get the tags, comments, files
  var tags = (parsedArgs.t ? helpers.convertToArray(parsedArgs.t) : []);
  var files = (parsedArgs.f ? helpers.convertToArray(parsedArgs.f) : []);
  var description = parsedArgs.d;
  var workspace = parsedArgs._[0];

  // If entered only `um update workspace` show the help
  if (inputArgs.length <= 0) {
    parsedArgs._.unshift('help', 'update', 'workspace');
    this.argv(parsedArgs._);
    return;
  }

  if (parsedArgs._.length > 1) {
    log.error('Only specify one workspace at a time.');
    return;
  }

  // If no workspace was passed, we can't do anything!
  if (!workspace) {
    log.error('You must enter a workspace.');
    return;
  }

  helpers.dirtyCommand();

  console.log(workspace);


  UM.tags.existingTagsFromTagList(tags, function(existingTags) {
    existingTags = _.pluck(existingTags, 'tag');
    var tagsDifference = _.difference(tags, existingTags);

    UM.files.existingFilesFromFileList(files, function(existingFiles) {
      existingFiles = _.pluck(existingFiles, 'file');
      var filesDifference = _.difference(files, existingFiles);

      if (tagsDifference.length > 0) unaddedTags(workspace, tagsDifference);
      if (filesDifference.length > 0) unaddedFiles(workspace, filesDifference);
      UM.workspaces.updateWorkspace(workspace, tags, files, description);
    });
  });
};