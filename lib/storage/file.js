// var utils = require('./une/util');
var helpers = require('../util/helpers');
var config = require('../../config');
var log = require('winston');
var colors = require('colors');
var _ = require('underscore');
var path = require('path');
var shell = require('shelljs');

// var promptly = require('promptly');

module.exports = File;

function File(storage) {
  this.storage = storage;

  // this.storage.ensureIndex({fieldName: 'inode', unique: true});
  this.storage.ensureIndex({fieldName: 'file', unique: true});
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
  var basename = path.basename(file);

  com = (comment !== undefined)? comment: '';

  this.fileExistsInDatabase(basename, function(exists) {
    // If the file is already in the database
    // We will be appending/updating the comments or something
    if (exists) {
      log.warn('%s already added to database ...', colors.blue(file));
      if (helpers.hasAny(tags)) that.addTags(file, tags);
      if (helpers.isComment(comment)) that.replaceComment(file, com);
      return;
    }

      // If it's not in the database let's check
      // to make sure it's an actual file on the path.
      // before we add it to the database.
      if (!helpers.fileExistsOnComputer(file)) {
        log.error('%s %s does not exist in that path.', colors.red('✖'), colors.blue(file));
        return;
      }

    // promptly.confirm('Would you like to  ', function (err, value) {
    //   console.log('Answer:', value);
    // });

    // Otherwise lets go ahead and add the file.
    var inum = helpers.inode(file);
    var p = helpers.fullpath(file);

    var f = { inode: inum
             , file: basename
             , path: p
             , comment: com
             , tags: tags
             , added: new Date()
        };
    that.storage.insert(f, function(err) {
      if (err) { 
        console.log('Error inserting doc');
        return;
      }
      that.moveToSourcedDirectory(p);
      log.info('%s %s is now being tracked.', colors.green('✓'), colors.blue(f.file));
    });
  });
}

File.prototype.addFiles = function(files, tags, comment) {
  var that = this;
  _.each(files, function(file) {
    that.addFile(file, tags, comment);
  });
}

File.prototype.addTags = function(file, tags) {
  if (!helpers.hasAny(tags)) return;
  this.storage.update({file: file}, { $addToSet: {tags: { $each: tags}}}, {}, function() {
    log.info('%s Tag(s) %s has been added to %s.', 
      colors.green('✓'), colors.blue(tags), colors.blue(file));
  });
}

File.prototype.replaceComment = function(file, comment) {
  var basename = path.basename(file);
  if (comment === '')
    return;

  this.storage.update({file: file}, { $set: {comment: comment}}, {}, function() {
    log.info('%s Comment has been replaced for file %s.', 
      colors.green('✓'), colors.blue(file));
  });
}

File.prototype.deleteFile = function(file) {
  var that = this;
  var basename = path.basename(file);

    this.getFile(basename, function(doc) {

      if (!doc) {
        console.log('No file found');
        return;
      }

      var p = doc.path;
      that.storage.remove({ file: basename }, {}, function (err, numRemoved) {
        if (err) {
          console.log('Error deleting document');
          return;
        }
        that.moveBackFromSourcedDirectory(p);
      });
    });
}

File.prototype.deleteFiles = function(files) {
   var that = this;
  _.each(files, function(file) {
    that.deleteFile(file);
  });
}

File.prototype.removeTagsAndCommentsFromFiles = function(files, tags, comment) {
  var that = this;
  _.each(files, function(file) {
    that.removeTagsAndCommentFromFile(file, tags, comment);
  });
}

File.prototype.removeTagsAndCommentFromFile = function(file, tags, comment) {
  var basename = path.basename(file);
  var that = this;

  this.fileExistsInDatabase(basename, function(exists) {
    // If the file is already in the database
    // We will be appending/updating the comments or something
    if (!exists) {
      log.warn('%s does not exist in database ...', colors.blue(basename));
      return;
    }

    if (helpers.hasAny(tags)) that.removeTagsFromFile(file, tags);
    if (comment) that.removeCommentFromFile(file);
  });
}

File.prototype.removeCommentFromFile = function(file) {
  var basename = path.basename(file);
  this.storage.update({file: basename}, { $set: {comment: ''}}, {}, function(err, num) {
    if (err) console.log('Error removing comment');
  });
}

File.prototype.removeTagsFromFile = function(file, tags) {
  var basename = path.basename(file);
  this.storage.update({file: basename}, {$pull: {tags: {$in: tags}}}, {}, function(err) {
    if (err) {console.log('error removing tags from file'); return; }

    log.info('%s Tags %s has been removed from file %s.', 
      colors.green('✓'), colors.blue(tags), colors.blue(file));
  });
}

File.prototype.removeTagsFromFilesWithThoseTags = function(tags) {
  var that = this;
  _.each(tags, function(tag) {
    that.removeTagFromFileWithThatTag(tag);
  });
}

File.prototype.removeTagFromFileWithThatTag = function(tag) {
  this.storage.update({tags: tag}, {$pull: {tags: tag}}, {multi: true}, function(err, num) {
    if (err) {console.log('Error removing tags'); return;}
  });
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


File.prototype.removeAllTags = function(file) {
  var basename = path.basename(file);
  this.storage.update({file: basename}, { $set: {tags: []}}, {}, function() {
    log.info('%s All tags have been removed from file %s.', 
      colors.green('✓'), colors.blue(file));
  });
}

// Getters

File.prototype.getFile = function(file, cb) {
  var basename = path.basename(file);
  var that = this;

  that.storage.find({file: basename}, function(err, doc) {
    if (!doc.length) {
      cb(null);
    }

    cb(doc[0]);
  });
}

File.prototype.getComment = function(file, cb) {
  var basename = path.basename(file);
  this.getFile(basename, function(doc) {
    cb(doc.comment);
  });
}

File.prototype.getTags = function(file, cb) {
  var basename = path.basename(file);
  this.getFile(basename, function(doc) {
    cb(doc.tags);
  });
}

File.prototype.sourcedPath = function(file) {
  var basename = path.basename(file);
  this.getFile(basename, function(doc) {
    var sPath = path.join(config.sources_path, basename);
    cb(sPath);
  });
}

// --------------------------------------------------------
// --------------------- HELPER FUNCTIONS -----------------
// --------------------------------------------------------

File.prototype.moveToSourcedDirectory = function(file, cb) {
  var basename = path.basename(file);
  var p = helpers.fullpath(file);
  var mvto = path.join(config.sources_path, basename);
  shell.mv(p, mvto);
}


// This take a full path of the file
File.prototype.moveBackFromSourcedDirectory = function(p, cb) {
  var basename = path.basename(p);
  var sPath = path.join(config.sources_path, basename);
  console.log('Moving file ' + basename + ' back to the path it was added from: ' + p);
  shell.mv(sPath, p);
} 

File.prototype.fileExistsInDatabase = function(file, cb) {
  // var inum = helpers.inode(file);
  var basename = path.basename(file);

  this.storage.find({file: basename}, function (err, docs) {
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