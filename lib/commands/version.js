// Prints the current version of the UM command.

var UM = require('../main');

module.exports = function() {
  // commands.printInfo(require('../../package.json').version);
  UM.emit('info', require('../../package.json').version);
};