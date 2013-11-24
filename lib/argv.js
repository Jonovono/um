// Takes the entered arguments and calls the appropriate function.

var _ = require('underscore');

module.exports = function(args) {
  // `lib/commands/` holds all of the possible commands. Get these
  // and store them to later look up and call on.

  var commands = this;

  // Aliases for help and verion
  // If the first command is one of these append to args.
  var wantsHelp = args.indexOf('-h') & args.indexOf('--help') & args.indexOf('help');
  if (wantsHelp !== -1) {
    args = _.without(args, '-h', '--help', 'help');
    args.unshift('help');
  }

  var wantsVersion = args.indexOf('-v') & args.indexOf('--version') & args.indexOf('version');
  if (wantsVersion !== -1) {
    args = _.without(args, '-v', '--version', 'version');
    args.unshift('version');
  }

  // If the command has no args, we display help.
  if (!args.length) {
    args.unshift('help');
  }

  // Get the arg in the first position to call that.
  var command = args[0];
  // If the first argument is a command in the directory, save it to call.
  if (typeof commands[command] === 'function')
    commands = commands[command];

  // Arg entered was not a standard command. Call the `unknown` command.
  if (commands === this) {
    this.unknown(args);
  } else {
    // Call the command entered.
    commands.call(this, args);
  }
};