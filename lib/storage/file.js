// var f = { inode: inum,
//               file: basename,
//               path: p,
//               comment: com,
//               url: url,
//               author: author,
//               tags: tags,
//               added: new Date()

// var utils = require('./une/util');
var helpers = require('../util/helpers');
var config = require('../../config');
var log = require('winston');
var colors = require('colors');
var _ = require('underscore');
var path = require('path');
var shell = require('shelljs');

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
};

File.prototype.getFiles = function(files, cb) {
  this.storage.find({ file: {$in: files}}, function(err, docs) {
    cb(docs);
  });
};

File.prototype.addFile = function(file, tags, comment, url, author) {
  var that = this;
  var basename = path.basename(file);

  com = (comment !== undefined)? comment: '';
  url = (url !== undefined)? url: '';
  author = (author !== undefined)? author: '';

  this.fileExistsInDatabase(basename, function(exists) {
    // If the file is already in the database
    // We will be appending/updating the comments or something
    if (exists) {
      log.warn('%s already added to database ...', colors.blue(basename));
      if (helpers.hasAny(tags)) that.addTags(file, tags);
      if (helpers.isComment(comment)) that.appendComment(file, com);
      return;
    }

      // If it's not in the database let's check
      // to make sure it's an actual file on the path.
      // before we add it to the database.
      if (!helpers.fileExistsOnComputer(file)) {
        log.error('%s %s does not exist in that path.', colors.red('✖'), colors.blue(basename));
        return;
      }

    // Otherwise lets go ahead and add the file.
    var inum = helpers.inode(file);
    var p = helpers.fullpath(file);

    var f = { inode: inum,
              file: basename,
              path: p,
              comment: com,
              url: url,
              author: author,
              tags: tags,
              added: new Date()
      };

    that.storage.insert(f, function(err) {
      if (err) { 
        log.error('File %s could not be added to database', colors.blue(basename));
        return;
      }
      that.moveToSourcedDirectory(p);
      log.info('%s %s is now being tracked and resides in %s', colors.green('✓'), 
                                                               colors.blue(basename), 
                                                               config.um_path);
    });
  });
};

File.prototype.addFiles = function(files, tags, comment, url, author) {
  var that = this;
  _.each(files, function(file) {
    that.addFile(file, tags, comment, url, author);
  });
};

File.prototype.updateFiles = function(files, tags, comment, url, author) {
  var that = this;
  _.each(files, function(file) {
    that.updateFile(file, tags, comment, url, author);
  });
};

File.prototype.updateFile = function(file, tags, comment, url, author) {
  var that = this;
  var basename = path.basename(file);

  com = (comment !== undefined)? comment: '';
  url = (url !== undefined)? url: '';
  author = (author !== undefined)? author: '';

  this.fileExistsInDatabase(basename, function(exists) {

    if (!exists) {
      log.warn('%s does not exist in database. Cannot be updated', colors.blue(basename));
      return;
    }

    // If the file is already in the database
    // We will be appending/updating the comments or something
    if (exists) {
      if (helpers.hasAny(tags)) that.addTags(file, tags);
      if (helpers.isComment(comment)) that.appendComment(file, com);
      if (helpers.containsText(url)) that.addUrl(file, url);
      if (helpers.containsText(author)) that.addAuthor(file, author);
      return;
    }
  });
};

File.prototype.addTags = function(file, tags) {
  var basename = path.basename(file);
  if (!helpers.hasAny(tags)) return;
  this.storage.update({file: basename}, { $addToSet: {tags: { $each: tags}}}, {}, function() {
    log.info('%s Tag(s) %s has been added to %s.', 
      colors.green('✓'), colors.blue(tags), colors.blue(basename));
  });
};

File.prototype.addTag = function(file, tag) {
  this.storage.update({file: file}, { $addToSet: {tags: tag}}, {}, function() {
    log.info('Tag %s added to file %s', colors.blue(tag), colors.blue(file));
  });
};

File.prototype.appendComment = function(file, comment) {
  var that = this;
  var basename = path.basename(file);
  var com = '';

  this.getComment(basename, function(c) {
    if (c === '' || !c || c.length === 0)
      com = comment;
    else
      com = c + '\n' + comment;

    that.storage.update({file: basename}, { $set: {comment: com}}, {}, function(err) {
      log.info('%s Comment has been appended to the old comment for file %s.', 
        colors.green('✓'), colors.blue(basename));
    });
  });
};

File.prototype.addUrl = function(file, url) {
  var basename = path.basename(file);

  this.storage.update({file: basename}, { $set: {url: url}}, {}, function() {
    console.log('Added Url to file %s', colors.blue(basename));
  });
};

File.prototype.addAuthor = function(file, author) {
  var basename = path.basename(file);

  this.storage.update({file: basename}, { $set: {author: author}}, {}, function() {
    console.log('Added Author to file %s', colors.blue(basename));
  });
};

File.prototype.replaceCommentForFile = function(file, comment) {
  var basename = path.basename(file);
  if (comment === '')
    return;

  this.storage.update({file: basename}, { $set: {comment: comment}}, {}, function() {
    log.info('%s Comment has been replaced for file %s.', 
      colors.green('✓'), colors.blue(basename));
  });
};

File.prototype.deleteFile = function(file) {
  var that = this;
  var basename = path.basename(file);

    this.getFile(basename, function(doc) {

      if (!doc) {
        log.error('%s not found', colors.blue(basename));
        return;
      }

      var p = doc.path;
      that.storage.remove({ file: basename }, {}, function (err, numRemoved) {
        if (err) {
          console.log('%s could not be deleted', colors.blue(basename));
          return;
        }
        that.moveBackFromSourcedDirectory(p);
        log.info('%s moved back to where it was originally: %s', colors.blue(basename), p);
      });
    });
};

File.prototype.deleteFiles = function(files) {
   var that = this;
  _.each(files, function(file) {
    that.deleteFile(file);
  });
};

File.prototype.removeTagsAndCommentsFromFiles = function(files, tags, comment, url, author) {
  var that = this;
  _.each(files, function(file) {
    that.removeTagsAndCommentFromFile(file, tags, comment, url, author);
  });
};

File.prototype.removeTagsAndCommentFromFile = function(file, tags, comment, url, author) {
  var basename = path.basename(file);
  var that = this;

  this.fileExistsInDatabase(basename, function(exists) {
    if (!exists) {
      log.warn('%s does not exist in database ...', colors.blue(basename));
      return;
    }

    if (helpers.hasAny(tags)) that.removeTagsFromFile(file, tags);
    if (comment) that.removeCommentFromFile(file);
    if (url) that.removeUrlFromFile(file);
    if (author) that.removeAuthorFromFile(file);
  });
};

File.prototype.removeCommentFromFile = function(file) {
  var basename = path.basename(file);
  this.storage.update({file: basename}, { $set: {comment: ''}}, {}, function(err, num) {
    if (err) {
      log.error('Could not remove comment from %s.', basename);
      return;
    }

    log.info('Comment removed from %s', colors.blue(basename));
  });
};

File.prototype.removeUrlFromFile = function(file) {
  var basename = path.basename(file);
  this.storage.update({file: basename}, { $set: {url: ''}}, {}, function(err, num) {
    if (err) {
      log.error('Could not remove Url from %s.', basename);
      return;
    }

    log.info('Url removed from %s', colors.blue(basename));
  });
};

File.prototype.removeAuthorFromFile = function(file) {
  var basename = path.basename(file);
  this.storage.update({file: basename}, { $set: {author: ''}}, {}, function(err, num) {
    if (err) {
      log.error('Could not remove Author from %s.', basename);
      return;
    }

    log.info('Author removed from %s', colors.blue(basename));
  });
};


File.prototype.removeTagsFromFile = function(file, tags) {
  var basename = path.basename(file);
  this.storage.update({file: basename}, {$pull: {tags: {$in: tags}}}, {}, function(err) {
    if (err) {log.error('Could not remove tags from %s.', basename); return; }

    log.info('%s Tags %s has been removed from file %s.', 
      colors.green('✓'), colors.blue(tags), colors.blue(file));
  });
};

File.prototype.removeTagsFromFilesWithThoseTags = function(tags) {
  var that = this;
  _.each(tags, function(tag) {
    that.removeTagFromFilesWithThatTag(tag);
  });
};

File.prototype.removeTagFromFilesWithThatTag = function(tag) {
  this.storage.update({tags: tag}, {$pull: {tags: tag}}, {multi: true}, function(err, num) {
    if (err) {log.error('Could not remove tags from those files'); return;}
  });
};

File.prototype.filesWithTag = function(tag, cb) {
  this.storage.find({ tags: tag}, function(err, docs) {
    cb(docs);
  });
};

File.prototype.countWithTag = function(tag, cb) {
  this.storage.count({tags: tag.tag}, function(err, count) {
    if (err) return cb(null);
    cb(count);
  });
};

File.prototype.filesWithTagsAnd = function(tags, cb) {
  var tagAndQuery = helpers.formatTagAndQuery(tags);

  this.storage.find({ $and: tagAndQuery}, function(err, docs) {
    // console.log(docs);
    cb(docs);
  });
};

File.prototype.filesWithTagsOr = function(tags, cb) {
  var tagAndQuery = helpers.formatTagAndQuery(tags);

  this.storage.find({ $or: tagAndQuery}, function(err, docs) {
    // console.log(docs);
    cb(docs);
  });
};

File.prototype.mergeTags = function(to, from) {
  var that = this;

  this.filesWithTagsOr(from, function(docs) {
    _.each(docs, function(doc) {
      that.addTag(doc.file, to);
    });
  });

  this.removeTagsFromFilesWithThoseTags(from);
};


File.prototype.removeAllTags = function(file) {
  var basename = path.basename(file);
  this.storage.update({file: basename}, { $set: {tags: []}}, {}, function() {
    log.info('%s All tags have been removed from file %s.', 
      colors.green('✓'), colors.blue(file));
  });
};

// Getters

File.prototype.getFile = function(file, cb) {
  var basename = path.basename(file);
  var that = this;

  that.storage.find({file: basename}, function(err, doc) {
    if (!doc.length) {
      cb(null);
      return;
    }

    cb(doc[0]);
  });
};

File.prototype.getComment = function(file, cb) {
  var basename = path.basename(file);
  this.getFile(basename, function(doc) {
    cb(doc.comment);
  });
};

File.prototype.getTags = function(file, cb) {
  var basename = path.basename(file);
  this.getFile(basename, function(doc) {
    cb(doc.tags);
  });
};

File.prototype.sourcedPath = function(file, cb) {
  var basename = path.basename(file);
  this.getFile(basename, function(doc) {
    if (!doc) return cb(null);
    var sPath = path.join(config.sources_path, basename);
    cb(sPath);
  });
};

// --------------------------------------------------------
// --------------------- HELPER FUNCTIONS -----------------
// --------------------------------------------------------

File.prototype.moveToSourcedDirectory = function(file, cb) {
  var basename = path.basename(file);
  var p = helpers.fullpath(file);
  var mvto = path.join(config.sources_path, basename);
  shell.mv(p, mvto);
};


// This take a full path of the file
File.prototype.moveBackFromSourcedDirectory = function(p, cb) {
  var basename = path.basename(p);
  var sPath = path.join(config.sources_path, basename);
  shell.mv(sPath, p);
};

File.prototype.fileExistsInDatabase = function(file, cb) {
  // var inum = helpers.inode(file);
  var basename = path.basename(file);

  this.storage.find({file: basename}, function (err, docs) {
    // Return true if file exists in the database
    // false otherwise
    cb(!!docs.length);
  });
};

File.prototype.passesFileChecks = function(file, cb) {
  if (!helpers.fileExistsOnComputer(file)) {
    log.error('%s %s does not exist in that path.', colors.red('✖'), colors.blue(file));
    return cb(false);
  }

  this.fileExistsInDatabase(file, function(exists) {
    if (!exists) log.error('%s %s not in database.', colors.red('✖'), colors.blue(file));
    cb(exists);
  });
};