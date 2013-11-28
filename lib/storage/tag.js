// var util = require('./util');
var log = require('winston');
var _ = require('underscore');
var color = require('colors');
var path = require('path');
var config = require('../../config');

function Tag(storage) {
  this.storage = storage;

  this.storage.ensureIndex({fieldName: 'tag', unique: true});
}

Tag.prototype.all = function(cb) {
  this.storage.find({}, function (err, docs) {
    cb(docs);
  });
};

Tag.prototype.addTag = function(tag, description) {
  var that = this;

  this.tagExistsInDatabase(tag, function(exists) {
    if (exists) {
      log.warn('Tag %s already exists.', color.blue(tag));
      return;
    }

    var t = { tag: tag,
              description: '',
              added: new Date()
      };
    that.storage.insert(t, function(err, doc) {
      if (err) {
        log.error('Tag %s could not be added', color.blue(tag));
        return;
      }
      log.info('Tag %s has been created.', color.blue(t.tag));
    });
  });
};

Tag.prototype.getTag = function(name, cb) {
  var that = this;

  this.storage.find({tag: name}, function(err, doc) {
    if (!doc.length) {
      cb(null);
      return;
    }

    cb(doc[0]);
  });
};

Tag.prototype.tagPath = function(tag, cb) {
  this.getTag(tag, function(doc) {
    if (!doc) return cb(null);
    var sPath = path.join(config.um_path, tag);
    cb(sPath);
  });
};

Tag.prototype.addTags = function(tags) {
  var that = this;
  _.each(tags, function(tag) {
    that.addTag(tag);
  });
};

Tag.prototype.deleteTag = function(tag) {
  this.storage.remove({tag: tag}, {}, function(err, num) {
    if (err) {
      log.error('Tag %s could not be deleted.', color.blue(tag));
      return;
    }
    log.info('Tag %s has been deleted.', color.blue(tag));
  });
};

Tag.prototype.deleteTags = function(tags) {
  var that = this;
  _.each(tags, function(tag) {
    that.deleteTag(tag);
  });
};

// --------------------------------------------------------
// --------------------- HELPER FUNCTIONS -----------------
// --------------------------------------------------------

Tag.prototype.tagExistsInDatabase = function(tag, cb) {
  this.storage.find({tag: tag}, function (err, docs) {
    // Return true if file exists in the database
    // false otherwise
    cb(!!docs.length);
  });
};

module.exports = Tag;