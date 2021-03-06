//*************         helpers.js            *****************************
// Provides helper functions to perform various useful tasks.
//**************************************************************************



var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var log = require('winston');
var shell = require('shelljs');
var config = require('../../config');

exports.inode = inode;
exports.fullpath = fullpath;
exports.getFullSourcePath = getFullSourcePath;
exports.isDirectory = isDirectory;
exports.fileExistsOnComputer = fileExistsOnComputer;
exports.convertToArray = convertToArray;
exports.hasAny = hasAny;
exports.isComment = isComment;
exports.formatTagAndQuery = formatTagAndQuery;
exports.formatTagQueryForTag = formatTagQueryForTag;
exports.formatFileQuery = formatFileQuery;
exports.validTagOrCommentRequest = validTagOrCommentRequest;
exports.validTagOrCommentRequestDelete = validTagOrCommentRequestDelete;
exports.updateLastResponse = updateLastResponse;
exports.generateTreeStructure = generateTreeStructure;
exports.containsText = containsText;
exports.dirtyCommand = dirtyCommand;

function inode(file) {
  return fs.statSync(file).ino;
}

function fullpath(file) {
  return path.resolve(file);
}

function getFullSourcePath(file) {
  return path.join(config.sources_path, file);
}

function isDirectory(p) {
  return fs.lstatSync(p).isDirectory();
}

function fileExistsOnComputer(file) {
  var p = fullpath(file);
  return fs.existsSync(p);
}

function convertToArray(ob) {
  if (!_.isArray(ob))
    return [ob];
  return _.uniq(ob);
}

function hasAny(arr) {
  return !!arr.length;
}

function isComment(comment) {
  if (comment === undefined || comment === '' || comment === true || comment === false)
    return false;
  else return true;
}

function containsText(something) {
  if (something === undefined || something === '' || something === true || something === false)
    return false;
  else return true;
}

function formatTagAndQuery(tags) {
  var resp = [];
  _.each(tags, function(tag, i) {
    resp[i] = {tags: tag};
  });
  return resp;
}

function formatTagQueryForTag(tags) {
  var resp = [];
  _.each(tags, function(tag, i) {
    resp[i] = {tag: tag};
  });
  return resp;
}

function formatFileQuery(files) {
  var resp = [];
  _.each(files, function(file, i) {
    resp[i] = {file: file};
  });
  return resp;
}

function validTagOrCommentRequest(args) {
  if (typeof args.c === 'boolean' || typeof args.t === 'boolean') {
    log.error('To add a tag/comment you need to give it a value.');
    return false;
  }
  if (args.c && !hasAny(args._)) {
    log.error('To add a comment you need to specify a file.');
    return false;
  }
  return true;
}

function validTagOrCommentRequestDelete(args) {
  if (typeof args.t === 'boolean') {
    log.error('Tag needs a value');
    return false;
  }
  if ((args.c || args.a || args.u) && !hasAny(args._)) {
    log.error('You need to specify a file when deleting a comment.');
    return false;
  }
  return true;
}

function updateLastResponse(resp) {
  fs.writeFile(config.last_response, JSON.stringify(resp), function(err) {
  });
}

function isMac() {
  if (process.platform === 'darwin') return true;
  return false;
}

function dirtyCommand() {
  fs.openSync(path.join(config.dirty_path), 'w');
}

function generateTreeStructure(files, tags, workspaces) {
  var that = this;

// First we want to delete the entire UM directory
// except the sources, and .data dir.
// Of course we could be creating this dynamically as 
// tags are created and files added, but decided to do this
// for now.
// It creates a nice tree structure in there so we can navigate it that way
// if we chose to.
shell.find(config.um_path).filter(function(file) {
  if (file.match(/sources/) || file.match(/\.data/) || file.match(/um$/)) {
    // console.log('matches', file);
  } else {
    // console.log('does not match', file);
    shell.rm('-rf', file);
  }
});

  // For each tag that we have, we create a directory for it
  // in the main UM path.
 _.each(tags, function(tag) {
  var p = path.join(config.um_path, tag.tag);
  shell.mkdir(p);
 }); 

 // Then for each file, and for each tag that file has
 // We create a symlink to the file in the sources dir
 // So basically it looks like
 // UM/tag/file ---> UM/sources/file.
 _.each(files, function(file) {
  var ts = file.tags;
  var name = file.file;

  _.each(ts, function(t) {
    var sourcePath = path.join(config.sources_path, name);
    var tagPath = path.join(config.um_path, t, name);
    fs.symlinkSync(sourcePath, tagPath);
  });
 });

  shell.mkdir(config.workspaces_path);

 _.each(workspaces, function(workspace) {
  var workspacePath = path.join(config.workspaces_path, workspace.name);
  shell.mkdir(workspacePath);

  _.each(workspace.files, function(file) {
    var filePath = path.join(config.sources_path, file);
    var fileWorkspacePath = path.join(workspacePath, file);
    if (that.isDirectory(filePath)) {
      fs.symlinkSync(filePath, fileWorkspacePath);
    } else {
      fs.linkSync(filePath, fileWorkspacePath);
    }
  });

  _.each(workspace.tags, function(tag) {
    var tagPath = path.join(config.um_path, tag);
    shell.ls(tagPath).forEach(function(file) {
      var filePath = path.join(config.sources_path, file);
      var fileWorkspacePath = path.join(workspacePath, file);
      if (!that.fileExistsOnComputer(fileWorkspacePath)) {
        if (that.isDirectory(filePath)) {
          fs.symlinkSync(filePath, fileWorkspacePath);
        } else {
          fs.linkSync(filePath, fileWorkspacePath);
        }
      }
    });
  });
 });
}