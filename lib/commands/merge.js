var UM = require('../main');

module.exports = function(args) {
  var parsedArgs = args.slice(1);

  if (parsedArgs.length <= 1) {
    parsedArgs.unshift('help', 'merge');
    this.argv(parsedArgs);
    return;
  }

  var to = parsedArgs[0];
  var from = parsedArgs.slice(1);

  UM.tags.addTags([to]);
  UM.files.mergeTags(to, from);
};