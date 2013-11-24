var UM = require('../main');
var argv = require('optimist');
var config = require('../../config');
var fs = require('fs');
var path = require('path');
var as = require('applescript');
var _ = require('underscore');
var log = require('winston');
var shell = require('shelljs');

var newTab = path.join('doc', 'applescript', 'new-terminal-tab.applescript');

module.exports = function(args) {
  var parsedArgs = argv.parse(args.slice(1));
  var dests = parsedArgs._;
  var first, rest;

  expandedDest = parsedArgs._;

  // If nums are passed (referring to previous response)
  // We need to replace those with the expanded file names.
  // var expandedDest = ifNumsExpandToFile(dests);


  // If no args passed to into we will just cd into the 
  // main UM directory where all the files are stored
  if (expandedDest.length === 0) {
    fs.writeFileSync(config.into_path, 'cd ' + config.um_path);
    return;
  }

  if (expandedDest.length >= 1)
    first = expandedDest[0];
  if (expandedDest.length > 1)
    rest = expandedDest.slice(1);

  // If we pass in one argument we will CD into that if it is a dir
  // else we will not.
  getProjectOrTagPath(first, function(p) {
    if (!p) {
      console.log('No file exists with that name.');
      return;
    }


    // CHeck if it is a file we can not CD into it
    if (fs.lstatSync(p).isFile()) {
      console.log('%s is a file.', path.basename(p));
      return;
    }

    // Write to this file we have. Basically this is how
    // We are able to CD from within the parent shell.
    // YOU MAY NOT LIKE THIS BUT I DO.
    // It writes to a file that is then sourced. making it execute the command.
    fs.writeFileSync(config.into_path, 'cd ' + p);
  });

  // THIS USES APPLESCRIPT
  // If we are passed more than one path to go into we use
  // applescript to open tabs.
  if (expandedDest.length > 1) {
    _.each(rest, function(going) {
        getProjectOrTagPath(going, function(p) {
          if (!p) {
            log.error('No file named %s.', going);
            return;
          } else {

            // CHeck if it is a file we can not CD into it
            if (fs.lstatSync(p).isFile()) {
              log.error('%s is a file.', path.basename(p));
            } else {
              openPathInNewTab(p);
            }
          }
        });
    });
  }
};

// Allow users to enter something like um into 1 2 3
// If the command before it is something like um files
// Where the list is numbered. The user can enter the number
// By the output to act upon that.
function ifNumsExpandToFile(dests) {
  var lastCommandResp = require(config.last_response);
  var ret = [];
  _.each(dests, function(dest) {
    if (typeof dest === 'number') {
      ret.push(lastCommandResp[--dest].file);
    } else {
      ret.push(dest);
    }
  });
  return ret;
}

function openPathInNewTab(p) {
  as.execFile(config.as_new_tab, [p], function(err, resp) {
    if (err) {
      log.error('Could not cd into %s', p);
      return;
    }
  });
}

function getProjectOrTagPath(name, cb) {
  if (name === '.') {
    return cb(shell.pwd());
  }

  UM.files.getFile(name, function(doc) {
    if (!doc) {
      UM.tags.getTag(name, function(tag) {
        if (!tag) {
          return cb(null);
        } else {
          return cb(path.join(config.um_path, tag.tag));
        }
      });
    } else {
        return cb(path.join(config.sources_path, doc.file));
    }
  });
}