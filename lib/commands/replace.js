// Used to replace a comment for a file

var UM = require('../main');

module.exports = function(args) {
  var parsedArgs = args.slice(1);

  if (parsedArgs.length <= 0) {
    parsedArgs.unshift('help', 'replace');
    this.argv(parsedArgs);
    return;
  }

  if (parsedArgs.length !== 2) {
    console.log('Need to enter a file and a comment, only');
    return;
  }

  var file = parsedArgs[0];
  var comment = parsedArgs[1];

  UM.files.replaceCommentForFile(file, comment);
};