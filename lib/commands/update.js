var UM = require('../main');
var argv = require('optimist');
var helpers = require('../util/helpers');

module.exports = function(args) {
  var inputArgs = args.slice(1);              // Commands in an array
  var parsedArgs = argv.parse(inputArgs);     // Parse them using optimist.

  // Get the tags, comments, files
  var tags = (parsedArgs.t ? helpers.convertToArray(parsedArgs.t) : []);
  var comment = parsedArgs.c;
  var files = parsedArgs._;
  var url = parsedArgs.u;
  var author = parsedArgs.a;

  // If entered only `um add` show the help
  if (inputArgs.length <= 0) {
    parsedArgs._.unshift('help', 'update');
    this.argv(parsedArgs._);
    return;
  }

  // If files were passed we can immediately add them.
  // as well as add any tags that were given to those files.
  if (!helpers.hasAny(files)) {
    console.log('You must pass in files to update');
    return;
  }
  
  UM.files.updateFiles(files, tags, comment, url, author);
};