// Handles viewing all the files (and their respectful data)

var UM = require('../main');
var argv = require('optimist');
var helpers = require('../util/helpers');
var formatter = require('../util/formatter');
var cnsl = require('../util/console');

module.exports = function(args) {
  var parsedArgs = argv.boolean(['t', 'c']).argv;
  UM.files.all(function(files) {
    formatter.files(files, function(data) {
      cnsl.printRows(data, ['num', 'file', 'comment', 'tags', 'url', 'author'], 
                            ['red', 'blue', 'blue', 'blue', 'blue', 'blue']);
    });
    helpers.updateLastResponse(files);
  });
};