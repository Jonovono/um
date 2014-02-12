// We have moved merging to UM merge <tag|workspace>
// So this just displays the help
// If you call UM merge

var UM = require('../main');

module.exports = function(args) {
  var parsedArgs = args.slice(1);

  if (parsedArgs.length <= 1) {
    parsedArgs.unshift('help', 'merge');
    this.argv(parsedArgs);
    return;
  }
};