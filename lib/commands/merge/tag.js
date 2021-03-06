// This handles merging tags together
// So basically um merge t1 t2 t3 t4 t5 ...
// Will delete tags t2 to the end (t5 this case)
// and will replace all of those with t1, keeping t1 alive!

var UM = require('../../main');
var helpers = require('../../util/helpers');

module.exports = function(args) {
  var parsedArgs = args.slice(2);

  if (parsedArgs.length <= 1) {
    parsedArgs.unshift('help', 'merge', 'tag');
    this.argv(parsedArgs);
    return;
  }

  helpers.dirtyCommand();

  var to = parsedArgs[0];
  var from = parsedArgs.slice(1);

  UM.tags.addTags([to], true);
  UM.tags.deleteTags(from);
  UM.files.mergeTags(to, from);
};