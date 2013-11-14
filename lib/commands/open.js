var argv = require('optimist');
var fs = require('fs');
var shell = require('shelljs');


var EDITOR = process.env.EDITOR;

module.exports = function(args) {
  var parsedArgs = argv.parse(args.slice(1));

  // If no args passed, show help.
  if (parsedArgs._.length === 0) {
    parsedArgs._.unshift('help', 'open');
    this.argv(parsedArgs._);
    return;
  }

  // shell.exec(makeCommand('path'));
}

function makeCommand(path) {
  return EDITOR + ' .';
}