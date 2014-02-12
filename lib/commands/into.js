// Handles CDing around into the directories in the database.
// This requires you to source umm completion.
// Eventually I will make this support passing in numbers.

var UM = require('../main');
var argv = require('optimist');
var config = require('../../config');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var log = require('winston');
var shell = require('shelljs');
var helpers = require('../util/helpers');
var exec = require('child_process').exec,
    child;

var newTabs = path.resolve('doc', 'applescript', 'new-terminal-tabs');

module.exports = function(args) {
  var count = args.slice(1).length;
  var first = args.slice(1)[0];
  var parsedArgs = argv.parse(args.slice(1));
  var files = parsedArgs._;
  var tags = (parsedArgs.t ? helpers.convertToArray(parsedArgs.t) : []);
  var workspaces = (parsedArgs.w ? helpers.convertToArray(parsedArgs.w) : []);

  // If no args passed to into we will just cd into the 
  // main UM directory where all the files are stored
  if (count === 0) {
    fs.writeFileSync(config.into_path, 'cd ' + config.um_path);
    return;
  }

  // This will be if we pass in only one file or one tag
  // that we want to go into. This will make the current
  // Terminal change. If we pass multiple it will open all in a new tab.
  if (files.length === 1 && tags.length === 0 ||
      files.length === 0 && tags.length === 1) {
  // if (files.length === 1) {
        var p;
        if (files.length === 1) {
          var f = files[0];
          p = helpers.getFullSourcePath(f);
          if (!helpers.isDirectory(p)) {
            log.error('Cannot go into %s because it is not a directory', f);
            return;
          }
        } 
        else {
          var t = tags[0];
          p = path.join(config.um_path, t);
        }
        fs.writeFileSync(config.into_path, 'cd ' + p);
        return;
  }

  getPathsFromFiles(files, function(filesArary) {
    getPathsFromTags(tags, function(tagsArray) {   //No CDing into tags for now.
      var both = _.union(filesArary, tagsArray);
      var toString = '';
      _.each(both, function(path) {
        toString += path + ' ';
      });
      // Calls the applescript file with a long string of paths.
      // Which then loops through each of them and
      exec(config.as_new_tab + ' ' + toString);
    });
  });
};


function getPathsFromFiles(files, cb) {
  var resp = [];
  _.each(files, function(file) {
    if (file === '.') resp.push(shell.pwd());
    else {
          var p = helpers.getFullSourcePath(file);
          if (helpers.isDirectory(p)) {
            resp.push(path.join(config.sources_path, file));
          } else {
            log.error('Cannot go into %s because it is not a directory', file);
          }
    }
  });
  cb(resp);
}

function getPathsFromTags(tags, cb) {
  var resp = [];
  _.each(tags, function(tag) {
    resp.push(path.join(config.um_path, tag));
  });
  cb(resp);
}


// Here are some commented out functions that I am not using now.
// 
// Allow users to enter something like um into 1 2 3
// If the command before it is something like um files
// Where the list is numbered. The user can enter the number
// By the output to act upon that.
// function ifNumsExpandToFile(dests) {
//   var lastCommandResp = require(config.last_response);
//   var ret = [];
//   _.each(dests, function(dest) {
//     if (typeof dest === 'number') {
//       ret.push(lastCommandResp[--dest].file);
//     } else {
//       ret.push(dest);
//     }
//   });
//   return ret;
// }

// function openPathInNewTab(p) {
//   as.execFile(config.as_new_tab, [p], function(err, resp) {
//     if (err) {
//       log.error('Could not cd into %s', p);
//       return;
//     }
//   });
// }

// function getProjectOrTagPath(name, cb) {
//   if (name === '.') {
//     return cb(shell.pwd());
//   }

//   UM.files.getFile(name, function(doc) {
//     if (!doc) {
//       UM.tags.getTag(name, function(tag) {
//         if (!tag) {
//           return cb(null);
//         } else {
//           return cb(path.join(config.um_path, tag.tag));
//         }
//       });
//     } else {
//         return cb(path.join(config.sources_path, doc.file));
//     }
//   });
// }