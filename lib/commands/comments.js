// Command to show all the files with their comment //

var UM = require('../main');
var formatter = require('../util/formatter');
var cnsl = require('../util/console');

module.exports = function(args) {
  UM.files.all(function(files) {
    formatter.fileNameAndComment(files, function(data) {
      cnsl.printRows(data, ['num', 'file', 'comment'], ['red', 'blue', 'blue']);
    });
  });
};