// Used to replace a comment for a file
// UM replace <file> <comment>


var UM = require('../main');

module.exports = function(args) {
  var parsedArgs = args.slice(1);

  if (parsedArgs.length <= 0) {
    parsedArgs.unshift('help', 'replace');
    this.argv(parsedArgs);
    return;
  }

  if (parsedArgs.length !== 2) {
    UM.emit('error', 'Replace comment for a file: <file> <comment>');
    return;
  }

  var file = parsedArgs[0];
  var comment = parsedArgs[1];

  UM.files.replaceCommentForFile(file, comment);
};