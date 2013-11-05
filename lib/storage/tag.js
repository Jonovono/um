// var util = require('./util');
var log = require('winston');
var _ = require('underscore');
var color = require('colors');

function Tags(storage) {
  this.storage = storage;

  this.storage.ensureIndex({fieldName: 'tag', unique: true});
}

// Tags.prototype.all = function() {
//  this.storage.find({}, function (err, docs) {
//     formatter.printTags(docs);
//   });
// }

Tags.prototype.all = function(cb) {
  this.storage.find({}, function (err, docs) {
    cb(docs);
  });
}

Tags.prototype.addTag = function(tag, description) {
  var that = this;

  this.tagExistsInDatabase(tag, function(exists) {
    if (exists) {
      log.warn('Tag %s already exists ...', color.blue(tag));
      return;
    }

    var t = { tag: tag
         , description: ''
         , added: new Date()
    };
    that.storage.insert(t);
    log.info('Tag %s has been created.', color.blue(t.tag));
  });
}

Tags.prototype.addTags = function(tags) {
  var that = this;
  _.each(tags, function(tag) {
    that.addTag(tag);
  });
}


Tags.prototype.getTag = function(tag) {

}

Tags.prototype.update = function(tag, description) {

}

Tags.prototype.deleteTag = function(file, tag) {

}

Tags.prototype.deleteTags = function(file, tags) {

}

Tags.prototype.deleteAllTags = function(file) {

}

Tags.prototype.addDescriptionToTag = function(tag, description) {

}




// --------------------------------------------------------
// --------------------- HELPER FUNCTIONS -----------------
// --------------------------------------------------------

Tags.prototype.tagExistsInDatabase = function(tag, cb) {
  this.storage.find({tag: tag}, function (err, docs) {
    // Return true if file exists in the database
    // false otherwise
    cb(!!docs.length);
  });
}

module.exports = Tags;