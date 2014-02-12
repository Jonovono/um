// Responsible for adding new workspaces to the database //
// UM add formula <formula-name> -d description

var UM = require('../../main');
var argv = require('optimist');
var helpers = require('../../util/helpers');
var log = require('winston');
var _ = require('underscore');
var colors = require('colors');
var editor = require('editor');

module.exports = function(args) {
  var inputArgs = args.slice(2);              // Commands in an array
  var parsedArgs = argv.parse(inputArgs);     // Parse them using optimist.
  var formula = parsedArgs._[0];
  var description = parsedArgs.d;

  console.log(formula);
  console.log(description);


  console.log("poop");

  editor(formula, function(code, sig) {
    console.log('finished editing', code);
  });

  if (parsedArgs._.length > 1) {
    log.error('Please only add one workspace at a time');
    return;
  }

  // If entered only `um add` show the help
  if (inputArgs.length <= 0) {
    parsedArgs._.unshift('help', 'add', 'formula');
    this.argv(parsedArgs._);
    return;
  }

  if (!formula) {
    log.error('You need to enter a workspace name');
    return;
  }

  // helpers.dirtyCommand();
};