// Prints out each file with it's tags.

var UM = require('../main');
var _ = require('underscore');

module.exports = function(args) {
  if (args.length === 1) {
    UM.tags.all(function(tags) {
      // helpers.updateLastResponse(tags);
      _.each(tags, function(tag, i) {
        UM.files.countWithTag(tag, function(count) {
          // console.log(formatter.formatTag(tag, count, i));
          console.log(tag, count);
        });
      });
    // commands.print(commands.formatTags(tags));
    });
  } else {
    var tags = args.slice(1);
      UM.files.filesWithTagsAnd(tags, function(docs) {
        console.log(docs);
      });
  }
};