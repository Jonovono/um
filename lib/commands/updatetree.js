// THIS IS MORE OF A PRIVATE COMMAND. NOT ONE CALLED BY THE USER
// Probably could be moved somewhere else, but this is how it is set up right now
// I'll look into other ways to have this called.
// I wanted something that could be called after the script executes to update the 
// Tree structure in the main UM directory.

var UM = require('../main');
var helpers = require('../util/helpers');

module.exports = function(args) {
  UM.files.all(function(files) {
    UM.tags.all(function(tags) {
      helpers.generateTreeStructure(files, tags);
    });
  });
};