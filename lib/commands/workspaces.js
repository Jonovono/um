// Command to show all the files with their comment //
// UM workspaces

var UM = require('../main');
var formatter = require('../util/formatter');
var cnsl = require('../util/console');

module.exports = function(args) {
  UM.workspaces.all(function(workspaces) {
    console.log(workspaces);
    formatter.workspaces(workspaces, function(data) {
      cnsl.printRows(data, ['num', 'workspace', 'description', 'files', 'tags'], 
                      ['red', 'blue', 'blue', 'blue', 'blue']);
    });
  });
};