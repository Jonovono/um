var UM = require('../main');
var argv = require('optimist');

module.exports = function(args) {
  var parsedArgs = argv.boolean(['t', 'c']).argv;
  UM.files.all(function(files) {
    // formatter.printFiles(files, parsedArgs.c, parsedArgs.t);
    console.log(files);
  });
};