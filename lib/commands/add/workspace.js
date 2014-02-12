// Responsible for adding new workspaces to the database //
// UM add workspace <workspace> -f file -t tag -d description (files/tags should exist)

var UM = require('../../main');
var argv = require('optimist');
var helpers = require('../../util/helpers');
var log = require('winston');
var _ = require('underscore');
var colors = require('colors');

module.exports = function(args) {
  var inputArgs = args.slice(2);              // Commands in an array
  var parsedArgs = argv.parse(inputArgs);     // Parse them using optimist.
  var workspace = parsedArgs._[0];
  var tags = (parsedArgs.t ? helpers.convertToArray(parsedArgs.t) : []);
  var description = parsedArgs.d;
  var files = (parsedArgs.f ? helpers.convertToArray(parsedArgs.f) : []);

  if (parsedArgs._.length > 1) {
    log.error('Please only add one workspace at a time');
    return;
  }

  // If entered only `um add` show the help
  if (inputArgs.length <= 0) {
    parsedArgs._.unshift('help', 'add', 'workspace');
    this.argv(parsedArgs._);
    return;
  }

  if (!workspace) {
    log.error('You need to enter a workspace name');
    return;
  }

  helpers.dirtyCommand();

  // Pretty messy. I would like to clean this up at some point
  // Basically, if I create a workspace and tell it files/tags
  // to put into it, I want to make sure those tags/files exist
  // in the database first. I suppose I could also just add those
  // on the go, but I'd like them in the DB first.
  UM.tags.existingTagsFromTagList(tags, function(existingTags) {
    existingTags = _.pluck(existingTags, 'tag');
    var tagsDifference = _.difference(tags, existingTags);

    UM.files.existingFilesFromFileList(files, function(existingFiles) {
      existingFiles = _.pluck(existingFiles, 'file');
      var filesDifference = _.difference(files, existingFiles);

      if (tagsDifference.length > 0) unaddedTags(workspace, tagsDifference);
      if (filesDifference.length > 0) unaddedFiles(workspace, filesDifference);
      UM.workspaces.addWorkspace(workspace, existingTags, existingFiles, description);
    });
  });
};

function unaddedTags(ws, tags) {
  log.warn('Tags %s could not be added to workspace %s because they do not exist in DB.',
            colors.blue(tags), colors.blue(ws));
}

function unaddedFiles(ws, files) {
  log.warn('Files %s could not be added to workspace %s because they do not exist in DB.',
            colors.blue(files), colors.blue(ws));
}