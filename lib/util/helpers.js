//*************         helpers.js            *****************************
// Provides helper functions to perform various useful tasks.
//**************************************************************************


var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var log = require('winston');

var LASTCOMMANDRESPONSE = path.join(__dirname, '..' , '..', 'doc', 'cli', 'lastreponse.json');

exports.inode = inode;
exports.fullpath = fullpath;
exports.fileExistsOnComputer = fileExistsOnComputer;
exports.convertToArray = convertToArray;
exports.hasAny = hasAny;
exports.isComment = isComment;
exports.formatTagAndQuery = formatTagAndQuery;
exports.validTagOrCommentRequest = validTagOrCommentRequest;
exports.validTagOrCommentRequestDelete = validTagOrCommentRequestDelete;
exports.updateLastResponse = updateLastResponse;

function inode(file) {
  return fs.statSync(file).ino;
}

function fullpath(file) {
  return path.resolve(file);
}

function fileExistsOnComputer(file) {
  return fs.existsSync(file);
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
  if (comment === undefined || comment === '')
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
    log.error('Comment should not have a value. Tag needs a value');
    return false;
  }
  if (args.c && !hasAny(args._)) {
    log.error('You need to specify a file when deleting a comment.');
    return false;
  }
  return true;
}

function updateLastResponse(resp) {
  fs.writeFile(LASTCOMMANDRESPONSE, JSON.stringify(resp), function(err) {
  });
}