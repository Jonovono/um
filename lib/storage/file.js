// var utils = require('./une/util');
var helpers = require('../util/helpers');
var log = require('winston');
var colors = require('colors');
var _ = require('underscore');
// var promptly = require('promptly');

var shell = require('shelljs');
// var path = require('path');

// var SOURCEDPATH = path.join(__dirname, '..' , 'data', 'sourced/');

module.exports = File;

function File(storage) {
  this.storage = storage;

  // this.storage.ensureIndex({fieldName: 'inode', unique: true});
  this.storage.ensureIndex({fieldName: 'file', unique: true});
}

File.prototype.testing = function() {
  console.log("LETS WORK");
}

File.prototype.all = function(cb) {

  this.storage.find({}, function (err, docs) {
    cb(docs);
  });
}

File.prototype.update = function(file, tags, comment) {

}

File.prototype.addFile = function(file, tags, comment) {
  var that = this;

  com = (comment !== undefined)? comment: '';

    // Make sure file is an actualy file first.
  if (!helpers.fileExistsOnComputer(file)) {
    log.error('%s %s does not exist in that path.', colors.red('✖'), colors.blue(file));
    return;
  }

  this.fileExistsInDatabase(file, function(exists) {
    // If the file is already in the database
    // We will be appending/updating the comments or something
    if (exists) {
      log.warn('%s already added to database ...', colors.blue(file));
      if (helpers.hasAny(tags) || helpers.isComment(com)) {
        that.addTags(file, tags);
        that.replaceComment(file, com);
      }
      return;
    }

    // promptly.confirm('Would you like to  ', function (err, value) {
    //   console.log('Answer:', value);
    // });

    // Otherwise lets go ahead and add the file.
    var inum = helpers.inode(file);
    var p = helpers.fullpath(file);

    var f = { inode: inum
             , file: file
             , path: p
             , comment: com
             , tags: tags
             , added: new Date()
        };
    that.storage.insert(f);
    // shell.mv(file, 'data/sourced/');
    log.info('%s %s is now being tracked.', colors.green('✓'), colors.blue(f.file));
  });
}

File.prototype.addFiles = function(files, tags, comment) {
  var that = this;
  _.each(files, function(file) {
    that.addFile(file, tags, comment);
  });
}

File.prototype.addTags = function(file, tags) {
  var inum = helpers.inode(file);

  this.storage.update({inode: inum}, { $addToSet: {tags: { $each: tags}}}, {}, function() {
    log.info('%s Tag(s) %s has been added to %s.', 
      colors.green('✓'), colors.blue(tags), colors.blue(file));
  });
}

File.prototype.replaceComment = function(file, comment) {
  if (comment === '')
    return;
  var inum = helpers.inode(file);

  this.storage.update({inode: inum}, { $set: {comment: comment}}, {}, function() {
    log.info('%s Comment has been replaced for file %s.', 
      colors.green('✓'), colors.blue(file));
  });
}

File.prototype.deleteFile = function(file) {
  var that = this;

  this.passesFileChecks(file, function(passes) {
    if (!passes) {
      return cb(null);
    }

    console.log('hulle');
  });
}

File.prototype.deleteFiles = function(files) {

}

File.prototype.filesWithTag = function(tag) {
  this.storage.find({ tags: tag}, function(err, docs) {
    console.log(docs);
  });
}

File.prototype.countWithTag = function(tag, cb) {
  this.storage.count({tags: tag.tag}, function(err, count) {
    if (err) return cb(null);
    cb(count);
  });
}

File.prototype.filesWithTags = function(tags) {
  var tagAndQuery = helpers.formatTagAndQuery(tags);

  this.storage.find({ $and: tagAndQuery}, function(err, docs) {
    console.log(docs);
  });
}

File.prototype.removeTag = function(file, tag) {

}

File.prototype.removeTags = function(file, tags) {
  var inum = helpers.inode(file);

  this.storage.update({inode: inum}, { $pull: {tags: { $each: tags}}}, {}, function() {
    log.info('%s Tags %s has been removed from file %s.', 
      colors.green('✓'), colors.blue(tags), colors.blue(file));
  });
}

File.prototype.removeAllTags = function(file) {
  var inum = helpers.inode(file);

  this.storage.update({inode: inum}, { $set: {tags: []}}, {}, function() {
    log.info('%s All tags have been removed from file %s.', 
      colors.green('✓'), colors.blue(file));
  });
}

// Getters

File.prototype.getFile = function(file, cb) {
  var that = this;

  this.passesFileChecks(file, function(passes) {
    if (!passes) {
      return cb(null);
    }

    var inum = helpers.inode(file);
    that.storage.find({inode: inum}, function(err, doc) {
      cb(doc[0]);
    });
  });
}

File.prototype.getComment = function(file, cb) {
  this.getFile(file, function(doc) {
    cb(doc.comment);
  });
}

File.prototype.getTags = function(file, cb) {
  this.getFile(file, function(doc) {
    cb(doc.tags);
  });
}

// --------------------------------------------------------
// --------------------- HELPER FUNCTIONS -----------------
// --------------------------------------------------------

File.prototype.fileExistsInDatabase = function(file, cb) {
  // var inum = helpers.inode(file);

  this.storage.find({file: file}, function (err, docs) {
    // Return true if file exists in the database
    // false otherwise
    cb(!!docs.length);
  });
}

File.prototype.passesFileChecks = function(file, cb) {
  if (!helpers.fileExistsOnComputer(file)) {
    log.error('%s %s does not exist in that path.', colors.red('✖'), colors.blue(file));
    return cb(false);
  }

  this.fileExistsInDatabase(file, function(exists) {
    if (!exists) log.error('%s %s not in database.', colors.red('✖'), colors.blue(file));
    cb(exists)
  });
}