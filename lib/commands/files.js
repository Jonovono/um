// Handles viewing all the files (and their respectful data)
// UM files

var UM = require('../main');
var argv = require('optimist');
var formatter = require('../util/formatter');
var cnsl = require('../util/console');

module.exports = function(args) {
  var parsedArgs = argv(args.slice(1)).boolean(['t', 'c']).argv;

  if (args.length === 1) {
    UM.files.all(function(files) {
      formatter.files(files, function(data) {
      cnsl.printRows(data, ['num', 'file', 'comment', 'tags', 'url', 'author'], 
                            ['red', 'blue', 'blue', 'blue', 'blue', 'blue']);
      });
    });
  } else {
    var files = parsedArgs._;
    UM.files.getFiles(files, function(resp) {
      formatter.files(resp, function(data) {
      cnsl.printRows(data, ['num', 'file', 'comment', 'tags', 'url', 'author'], 
                            ['red', 'blue', 'blue', 'blue', 'blue', 'blue']);
      });
    });
  }
};