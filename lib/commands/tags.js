// Prints out each file with it's tags.

var UM = require('../main');
var _ = require('underscore');
var formatter = require('../util/formatter');
var cnsl = require('../util/console');

module.exports = function(args) {

  // If just called um tags we show every tag
  // And show the count of files that have that tag.
  if (args.length === 1) {
    UM.tags.all(function(tags) {
      formatter.tags(tags, function(data) {
        cnsl.printRows(data, ['num', 'tag'],
                        ['red', 'blue']);
      });

      // _.each(tags, function(tag, i) {
      //   UM.files.countWithTag(tag, function(count) {
      //     // console.log(formatter.formatTag(tag, count, i));
      //     console.log(tag, count);
      //   });
      // });
    });
  } 
  // Else if we have arguments after um tags <t1>...
  // we only show the files that have that tag.
  else {
    var tags = args.slice(1);
      UM.files.filesWithTagsAnd(tags, function(docs) {
        formatter.files(docs, function(data) {
          cnsl.printRows(data, ['num', 'file', 'comment', 'tags', 'url', 'author'], 
                               ['red', 'blue', 'blue', 'blue', 'blue', 'blue']);
        });
      });
  }
};