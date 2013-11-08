var UM = require('../main');

module.exports = function(args) {
  UM.files.all(function(files) {
    // formatter.printFiles(files, true, false);
    console.log(files);
  });
};